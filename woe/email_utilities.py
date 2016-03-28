from woe import app
from mako.template import Template
from mako.lookup import TemplateLookup
from woe import sqla
import woe.sqlmodels as sqlm
import requests, arrow
from BeautifulSoup import BeautifulSoup
from woe.utilities import get_preview_for_email
from sqlalchemy.orm.attributes import flag_modified

_mylookup = TemplateLookup(directories=[app.config['MAKO_EMAIL_TEMPLATE_DIR']])
_debug = app.config['DEBUG']
_api = app.config['MGAPI']
_base_url = app.config['BASE']

def send_notification_emails():
    _users_to_check = sqla.session.query(sqlm.User) \
        .filter(
            sqla.or_(
                sqlm.User.last_sent_notification_email == None,
                sqlm.User.last_sent_notification_email < arrow.utcnow().replace(minutes=-30).datetime.replace(tzinfo=None)
            )
        ).all()

    notification_formats = {}
    notification_full_names = {}
    for t in sqlm.Notification.NOTIFICATION_CATEGORIES:
        notification_formats[t[0]] = t[3]
        notification_full_names[t[0]] = (t[4], t[5])

    for u in _users_to_check:
        if u.banned:
            continue

        notifications = sqla.session.query(sqlm.Notification) \
            .filter_by(seen=False, acknowledged=False, emailed=False) \
            .filter_by(user=u) \
            .order_by(sqla.desc(sqlm.Notification.created)).all()
        notifications_count = len(notifications)

        # if notifications_count > 0:
        #     print notifications
        #     print notifications_count
        # continue

        try:
            if u.last_sent_notification_email > arrow.utcnow().replace(minutes=-u.minimum_time_between_emails).datetime.replace(tzinfo=None):
                continue
        except:
            pass

        _list = []
        _list_k = {}
        _list_url = {}

        _details = []
        _details_k = {}

        _summaries = []
        _summaries_k = {}
        _total = 0

        for n in notifications:
            if u.notification_preferences is None:
                u.notification_preferences = {}
                flag_modified(u, "notification_preferences")
                sqla.session.add(u)
                sqla.session.commit()

            if not u.notification_preferences.get(n.category, {"email": True}).get("email"):
                continue
            else:
                _total += 1

            if notification_formats[n.category] == "summarized":
                if not _summaries_k.has_key(n.category):
                    _summaries_k[n.category] = 1
                    _summaries.append(n.category)
                else:
                    _summaries_k[n.category] += 1

            if notification_formats[n.category] == "listed":
                if not _summaries_k.has_key(n.category):
                    _summaries_k[n.category] = 1
                    _summaries.append(n.category)
                else:
                    _summaries_k[n.category] += 1

                if _list_url.has_key(_base_url+n.url):
                    _list_url[_base_url+n.url] += 1
                    continue
                else:
                    _list_url[_base_url+n.url] = 1

                if not _list_k.has_key(n.category):
                    _list_k[n.category] = [{
                        "message": n.message,
                        "url": _base_url+n.url
                    }]
                    _list.append(n.category)
                else:
                    _list_k[n.category].append({
                        "message": n.message,
                        "url": _base_url+n.url
                    })

            if notification_formats[n.category] == "detailed":
                if not _summaries_k.has_key(n.category):
                    _summaries_k[n.category] = 1
                    _summaries.append(n.category)
                else:
                    _summaries_k[n.category] += 1

                if not _details_k.has_key(n.category):
                    _details_k[n.category] = [{
                        "url": _base_url+n.url,
                        "message": n.message,
                        "description": get_preview_for_email(n.snippet)
                    }]
                    _details.append(n.category)
                else:
                    _details_k[n.category].append({
                        "url": _base_url+n.url,
                        "message": n.message,
                        "description": get_preview_for_email(n.snippet)
                    })

        if not u.emails_muted:
            _to_email_address = False
            if _debug:
                if not u.is_admin and not u.is_allowed_during_construction:
                    continue
                else:
                    _to_email_address = u.email_address
            else:
                _to_email_address = u.email_address

            if len(_list) == 0 and len(_details) == 0 and len(_summaries) == 0:
                continue

            try:
                if _total < u.minimum_notifications_for_email:
                    continue
            except:
                continue

            _template = _mylookup.get_template("notification.txt")
            _rendered = _template.render(
                _user = u,
                _base = _base_url,
                _list = _list,
                _list_k = _list_k,
                _list_url = _list_url,
                _details = _details,
                _details_k = _details_k,
                _summaries = _summaries,
                _summaries_k = _summaries_k,
                _notification_names = notification_full_names
                )

            # print _rendered

            u.last_sent_notification_email = arrow.utcnow().datetime.replace(tzinfo=None)
            sqla.session.add(u)
            sqla.session.commit()

            notifications_update = sqla.session.query(sqlm.Notification) \
                .filter_by(seen=False, acknowledged=False, emailed=False) \
                .filter_by(user=u) \
                .all()
            for n in notifications_update:
                n.emailed=True
                sqla.session.add(n)
            sqla.session.commit()

            print _rendered

            return requests.post(
                "https://api.mailgun.net/v3/scarletsweb.moe/messages",
                auth=("api", _api),
                data={"from": "Scarlet's Web <sally@scarletsweb.moe>",
                      "to": _to_email_address,
                      "subject": "You have %s notifications at Scarletsweb.moe" % (_total,),
                      "text": _rendered})

def send_mail_w_template(send_to, subject, template, variables):
    _to_email_addresses = []
    for user in send_to:
        if _debug:
            if not user.is_admin and not user.is_allowed_during_construction:
                continue
            else:
                _to_email_addresses.append(user.email_address)
        else:
            _to_email_addresses.append(user.email_address)
    _template = _mylookup.get_template(template)

    # print _to_email_addresses
    # print template
    # print variables
    # print _template.render(**variables)

    return requests.post(
        "https://api.mailgun.net/v3/scarletsweb.moe/messages",
        auth=("api", _api),
        data={"from": "Scarlet's Web <sally@scarletsweb.moe>",
              "to": _to_email_addresses,
              "subject": subject,
              "text": _template.render(**variables)})