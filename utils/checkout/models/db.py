#########################################################################
# This scaffolding model makes your app work on Google App Engine too   #
#########################################################################

try:
    from gluon.contrib.gql import *         # if running on Google App Engine
except:
    db=SQLDB('sqlite://storage.db')         # if not, use SQLite or other DB
else:
    db=GQLDB()                              # connect to Google BigTable
    session.connect(request,response,db=db) # and store sessions there
#session.forget()                           # uncomment for no session at all

#########################################################################
# Define your tables below, for example                                 #
#                                                                       #
# >>> db.define_table('mytable',SQLField('myfield','string'))           #
#                                                                       #
# Fields can be 'string','text','password','integer','double','booelan' #
#       'date','time','datetime','blob','upload', 'reference TABLENAME' #
# There is an implicit 'id integer autoincrement' field                 #
# Consult manual for more options, validators, etc.                     #
#                                                                       #
# More API examples for controllers:                                    #
#                                                                       #
# >>> db.mytable.insert(myfield='value')                                #
# >>> rows=db(db.mytbale.myfield=='value).select(db.mytable.ALL)        #
# >>> for row in rows: print row.id, row.myfield                        #
#########################################################################

db.define_table('order',
   db.Field('order_id',length=64),
   db.Field('status',length=64))