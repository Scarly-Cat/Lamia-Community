from woe import login_manager, app
from woe.models.core import User, Notification
from flask import abort, redirect, url_for, request, render_template, make_response, json, flash
from woe.utilities import get_top_frequences, scrub_json, humanize_time, ForumHTMLCleaner, parse_search_string_return_q
from flask.ext.login import login_required, current_user
import arrow, urllib2
from threading import Thread
import json as py_json
from woe import sqla
import woe.sqlmodels as sqlm
import hashlib

def send_message(data):
    req = urllib2.Request(app.settings_file["listener"]+"/notify")
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req, py_json.dumps(data))

def broadcast(to, category, url, title, description, content, author, priority=0):
    if category not in [x[0] for x in Notification.NOTIFICATION_CATEGORIES]:
        raise TypeError("Category is not defined in NOTIFICATION_CATEGORIES.")

    if to == "ALL":
        to = sqla.session.query(sqlm.User).filter_by(banned=False).all()

    now = arrow.utcnow()
    author = author

    for u in to:
        try:
            if not type(u) == sqlm.User:
                user = sqla.session.query(sqlm.User).filter_by(login_name=to)[0]
            else:
                user = u
            try:
                if current_user._get_current_object() == user:
                    continue
            except:
                pass
        except IndexError:
            continue

        if user.notification_preferences is None:
            user.notification_preferences = {}
            sqla.session.add(user)
            sqla.session.commit()

        if not user.notification_preferences.get(category, {"dashboard": True}).get("dashboard"):
            continue

        try:
            ignore = sqla.session.query(sqlm.IgnoringUser).filter_by(user=user, ignoring=author)[0]
            continue
        except:
            pass

        new_notification = sqlm.Notification(
            category = category,
            user = user,
            author = author,
            created = now.datetime.replace(tzinfo=None),
            url = url,
            message = title,
            priority = priority
        )

        sqla.session.add(new_notification)
        sqla.session.commit()

        reference = hashlib.md5(url).hexdigest()

        data = {
            "users": [u.login_name, ],
            "count": u.get_notification_count(),
            "dashboard_count": u.get_dashboard_notifications(),
            "category": category,
            "author": author.display_name,
            "member_name": author.login_name,
            "member_pk": unicode(author.id),
            "member_disp_name": author.display_name,
            "author_url": "/member/"+author.login_name,
            "time": humanize_time(now.datetime),
            "url": url,
            "stamp": arrow.get(new_notification.created).timestamp,
            "text": title,
            "priority": priority,
            "_id": str(new_notification.id)
        }
        data["reference"] = reference

        thread = Thread(target=send_message, args=(data, ))
        thread.start()

@app.route('/dashboard/ack_category', methods=["POST",])
@login_required
def acknowledge_category():
    notifications = sqla.session.query(sqlm.Notificaion) \
        .filter_by(seen=False, user=current_user._get_current_object()) \
        .update({seen: True})

    request_json = request.get_json(force=True)

    notifications = sqla.session.query(sqlm.Notificaion) \
        .filter_by(acknowledged=False, user=current_user._get_current_object(), category=request_json.get("category","")) \
        .update({acknowledged: True})

    return app.jsonify(success=True, count=current_user._get_current_object().get_dashboard_notifications())

@app.route('/dashboard/mark_seen', methods=["POST",])
@login_required
def mark_all_notifications():
    notifications = sqla.session.query(sqlm.Notificaion) \
        .filter_by(seen=False, user=current_user._get_current_object()) \
        .update({seen: True})

    return app.jsonify(success=True)

@app.route('/dashboard/ack_notification', methods=["POST",])
@login_required
def acknowledge_notification():
    notifications = sqla.session.query(sqlm.Notificaion) \
        .filter_by(seen=False, user=current_user._get_current_object()) \
        .update({seen: True})

    request_json = request.get_json(force=True)
    try:
        notification = sqla.session.query(sqlm.Notificaion) \
            .filter_by(id=request_json.get("notification",""))[0]

        if notification.user != current_user._get_current_object():
            return app.jsonify(success=False)

        sqla.session.query(sqlm.Notificaion) \
            .filter_by(id=request_json.get("notification","")) \
            .update({acknowledged: True})
    except:
        return app.jsonify(success=False)

    try:
        notifications = sqla.session.query(sqlm.Notificaion) \
            .filter_by(acknowledged=False, user=current_user._get_current_object(), url=notification.url) \
            .update({acknowledged: True})
    except:
        return app.jsonify(success=False)

    return app.jsonify(success=True, count=current_user._get_current_object().get_dashboard_notifications())

@app.route('/dashboard/notifications', methods=["POST",])
@login_required
def dashboard_notifications():
    notifications = Notification.objects(user=current_user._get_current_object(), acknowledged=False)
    parsed_notifications = []

    for notification in notifications:
        try:
            parsed_ = {}
            parsed_["time"] = humanize_time(notification.created)
            parsed_["stamp"] = arrow.get(notification.created).timestamp
            parsed_["member_disp_name"] = notification.author.display_name
            parsed_["member_name"] = notification.author.login_name
            parsed_["member_pk"] = unicode(notification.author.id)
            parsed_["text"] = notification.message
            parsed_["id"] = notification.id
            parsed_["category"] = notification.category
            parsed_["reference"] = hashlib.md5(notification.url).hexdigest()
            parsed_notifications.append(parsed_)
        except AttributeError:
            pass

    return app.jsonify(notifications=parsed_notifications)

@app.route('/dashboard')
@login_required
def view_dashboard():
    return render_template("dashboard.jade", page_title="Your Dashboard - World of Equestria")
