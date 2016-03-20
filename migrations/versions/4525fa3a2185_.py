"""empty message

Revision ID: 4525fa3a2185
Revises: f8e3872c30e7
Create Date: 2016-03-19 11:45:06.248556

"""

# revision identifiers, used by Alembic.
revision = '4525fa3a2185'
down_revision = 'f8e3872c30e7'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('label', sa.Column('modern', sa.Boolean(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('label', 'modern')
    ### end Alembic commands ###