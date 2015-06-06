from woe import app
from woe.models.core import PrivateMessageTopic
from flask import abort, redirect, url_for, request, render_template, make_response, json, flash, session
from flask.ext.login import login_user, logout_user, current_user, login_required
import arrow, time
from woe.utilities import get_top_frequences, scrub_json, humanize_time, ForumPostParser, ForumHTMLCleaner

@app.route('/message-topics', methods=['POST'])
@login_required
def messages_topics():
    print time.time()
    request_json = request.get_json(force=True)
    page = request_json.get("page", 1)
    pagination = request_json.get("pagination", 20)

    try:
        minimum = (int(page)-1)*int(pagination)
        maximum = int(page)*int(pagination)
    except:
        minimum = 0
        maximum = 20
        
    messages = PrivateMessageTopic.objects(participating_users=current_user._get_current_object()).order_by("-last_reply_time").select_related(0)[minimum:maximum+10]
    print time.time()
    parsed_messages = []
    
    for message in messages:
        participating = False
        for participant in message.participants:
            if participant.user == current_user._get_current_object():
                if not participant.left_pm and not participant.blocked:
                    participating = True
            
        if not participating:
            continue
            
        _parsed = message.to_mongo().to_dict()
        _parsed["creator"] = message.creator.display_name
        _parsed["created"] = humanize_time(message.created, "MMM D YYYY")
        
        _parsed["last_post_date"] = humanize_time(message.last_reply_time)
        _parsed["last_post_by"] = message.last_reply_by.display_name
        _parsed["last_post_x"] = message.last_reply_by.avatar_40_x
        _parsed["last_post_y"] = message.last_reply_by.avatar_40_y
        _parsed["last_post_by_login_name"] = message.last_reply_by.login_name
        _parsed["last_post_author_avatar"] = message.last_reply_by.get_avatar_url("40")
        _parsed["post_count"] = "{:,}".format(message.message_count)
        try:
            _parsed["last_page"] = float(message.message_count)/float(pagination)
        except:
            _parsed["last_page"] = 1
        _parsed["last_pages"] = _parsed["last_page"] > 1
        del _parsed["participants"]
        parsed_messages.append(_parsed)
    print time.time()
        
    return app.jsonify(topics=parsed_messages[minimum:maximum], count=len(parsed_messages))

@app.route('/messages', methods=['GET'])
@login_required
def messages_index():
    return render_template("core/messages.jade")
