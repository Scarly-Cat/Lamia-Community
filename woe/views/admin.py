from woe import app
from flask import abort, redirect, url_for, request, render_template, make_response, json, flash
from flask.ext.login import login_required, current_user
import flask_admin as admin
from flask_admin import helpers, expose
from flask_admin.contrib.sqla import ModelView
from woe import sqla
import woe.sqlmodels as sqlm
from jinja2 import Markup
import arrow

class AuthAdminIndexView(admin.AdminIndexView):
    @expose('/')
    def index(self):
        if not current_user.is_mod and not current_user.is_admin:
            return redirect("/")
            
        all_active_reports = sqlm.Report.query.filter(sqlm.Report.status.in_(["open", "feedback", "waiting"])).count()
        recent_infractions = sqlm.Infraction.query.filter(sqlm.Infraction.created > arrow.utcnow().replace(days=-7).datetime).count()
        active_bans = sqlm.Ban.query.filter_by(forever=False).filter(sqlm.Ban.expires > arrow.utcnow().datetime).count()
            
        if current_user.is_admin:
            my_area_reports = all_active_reports
        else:
            my_area_reports = sqlm.Report.query.filter(
                    sqlm.Report.status.in_(["open", "feedback", "waiting"]),
                    sqlm.Report.report_area.in_(current_user.get_modded_areas())
                ).count()
        
        return self.render('admin/index.html', 
                all_active_reports=all_active_reports,
                recent_infractions=recent_infractions,
                active_bans=active_bans,
                my_area_reports=my_area_reports
            )

admin = admin.Admin(app, index_view=AuthAdminIndexView(), name="Staff CP")


