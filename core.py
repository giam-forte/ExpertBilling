# coding=utf8
import sys,time,os,datetime
from SocketServer import ThreadingTCPServer
from SocketServer import StreamRequestHandler
from threading import Thread
import dictionary
import packet
import struct, tools
import corepacket
#os.environ['DJANGO_SETTINGS_MODULE'] = 'mikrobill.settings'
#sys.path.append('c:\\Python25\\Scripts')
#from mikrobill.radius.models import Session
#from mikrobill.billing.models import Account, Tarif
#from mikrobill.nas.models import Nas

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
try:
    conn = psycopg2.connect("dbname='mikrobill' user='mikrobill' host='localhost' password='1234'")
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
except:
    print "I am unable to connect to the database"
    
cur = conn.cursor()

dict=dictionary.Dictionary("dicts\dictionary","dicts\dictionary.microsoft")
t = time.clock()

class handle_auth(StreamRequestHandler):
    def handle(self):
        # self.request is the socket object
        #print "%s I got an request from ip=%s port=%s" % (
        #    time.strftime("%Y-%m-%d %H:%M:%S"),
        #    self.client_address[0],
        #    self.client_address[1]
        #    )
        #self.request.send("What is your name?\n")
        bufsize=4096
        response=self.request.recv(bufsize).strip() # or recv(bufsize, flags)
        (requestpacketid, code, nasip, length)=struct.unpack("!LB4sH",response[:11])
        nasip=tools.DecodeAddress(nasip)
        packetobject=packet.Packet(dict=dict,packet=response[11:])
        cur.execute("""SELECT secret from nas_nas WHERE ipaddress='%s'""" % nasip)
        rows = cur.fetchall()
        for row in rows:
            secret=str(row[0])
            

        #nassecret=Nas.objects.get(ipaddress=nasip)


        ##Здесь нужно организовать проверку наличия в базе имени пользователя
        ##Если есть-подставляем в объект и ставим атрибут code=2, наче code=3
        replypacket=corepacket.CorePacket(secret=secret, dict=dict)
        
        #account=Account.objects.get(username=packetobject['User-Name'][0], ballance__gt=0)

        cur.execute("""SELECT username, password, ipaddress from billing_account WHERE username='%s'""" % packetobject['User-Name'][0])

        rows = cur.fetchall()
        
        for row in rows:
            username  = row[0]
            password  = row[1]
            ipaddress = row[2]


        if packetobject['User-Name'][0]==username:
           replypacket.code=2
           replypacket.username=str(username) #Нельзя юникод
           replypacket.password=str(password) #Нельзя юникод
           replypacket.AddAttribute('Service-Type', 2)
           replypacket.AddAttribute('Framed-Protocol', 1)
           replypacket.AddAttribute('Framed-IP-Address', ipaddress)
           replypacket.AddAttribute('Framed-Routing', 0)

        else:
            replypacket.username='None'
            replypacket.password='None'
            replypacket.code=3


        data_to_send=replypacket.ReplyPacket()
        #data_to_send=replypacket._PktEncodeAttributes()
        self.request.sendto(data_to_send,self.client_address) # or send(data, flags)
        #print "%s connection finnished" % self.client_address[0]
        
class handle_acct(StreamRequestHandler):
        def handle(self):
        # self.request is the socket object
            #print "%s I got an request from ip=%s port=%s" % (
            #time.strftime("%Y-%m-%d %H:%M:%S"),
            #self.client_address[0],
            #self.client_address[1]
            #)
            #self.request.send("What is your name?\n")
            
            bufsize=8096
            response=self.request.recv(bufsize).strip() # or recv(bufsize, flags)
            (requestpacketid, code, nasip, length)=struct.unpack("!LB4sH",response[:11])
            nasip=tools.DecodeAddress(nasip)
            packetobject=packet.Packet(dict=dict,packet=response[11:])
            ##Здесь нужно организовать проверку наличия в базе имени пользователя
            ##Если есть-подставляем в объект и ставим атрибут code=2, наче code=3
            
            if packetobject['Acct-Status-Type']==['Start']:
                #sess.account=Account.objects.get(username=packetobject['User-Name'][0])
                #sess.sessionid=packetobject['Acct-Session-Id'][0]
                #sess.caller_id=packetobject['Calling-Station-Id'][0]
                #sess.called_id=packetobject['Called-Station-Id'][0]
                #sess.nas_id=packetobject['NAS-IP-Address'][0]
                #sess.save()
                cur.execute(
                """
                INSERT INTO radius_session(
                account_id, sessionid, date_start,
                caller_id, called_id, nas_id, framed_protocol
                )
                VALUES ((SELECT id FROM billing_account WHERE username=%s), %s, %s, %s, %s, %s, 'PPTP');
                """, (packetobject['User-Name'][0], packetobject['Acct-Session-Id'][0], datetime.datetime.now(), packetobject['Calling-Station-Id'][0], packetobject['Called-Station-Id'][0], packetobject['NAS-IP-Address'][0]))
                

            if packetobject['Acct-Status-Type']==['Alive']:
                #sess=Session()
                #sess=Session.objects.get(sessionid=packetobject['Acct-Session-Id'][0])
                #sess.session_time=packetobject['Acct-Session-Time'][0]
                #sess.bytes_in=packetobject['Acct-Input-Packets'][0]
                #sess.bytes_out=packetobject['Acct-Output-Packets'][0]
                #sess.save()
                cur.execute(
                """
                UPDATE radius_session SET
                session_time=%s, bytes_in=%s, bytes_out=%s
                WHERE
                sessionid=%s;
                """, (packetobject['Acct-Session-Time'][0],packetobject['Acct-Input-Octets'][0], packetobject['Acct-Output-Octets'][0], packetobject['Acct-Session-Id'][0]))


            if packetobject['Acct-Status-Type']==['Stop']:
                #sess=Session()
                #sess=Session.objects.get(sessionid=packetobject['Acct-Session-Id'][0])
                #sess.session_time=packetobject['Acct-Session-Time'][0]
                #sess.bytes_in=packetobject['Acct-Input-Packets'][0]
                #sess.bytes_out=packetobject['Acct-Output-Packets'][0]
                #sess.date_end=datetime.datetime.now()
                #sess.save()
                cur.execute(
                """
                UPDATE radius_session SET
                session_time=%s, bytes_in=%s, bytes_out=%s, date_end=%s
                WHERE
                sessionid=%s;
                """, (packetobject['Acct-Session-Time'][0],packetobject['Acct-Input-Octets'][0], packetobject['Acct-Output-Octets'][0], datetime.datetime.now(), packetobject['Acct-Session-Id'][0]))

#            for key,value in packetobject.items():
#                print packetobject._DecodeKey(key),packetobject[packetobject._DecodeKey(key)]
            cur.execute("""SELECT secret from nas_nas WHERE ipaddress='%s'""" % nasip)
            rows = cur.fetchall()
            for row in rows:
                secret=str(row[0])

            #try:
            #    nas=Nas.objects.get(ipaddress=nasip)
            #except:
            #    pass
            ##Здесь нужно организовать проверку наличия в базе имени пользователя
            ##Если есть-подставляем в объект и ставим атрибут code=2, наче code=3


            replypacket=corepacket.CorePacket(username="None",secret=str(secret), password="None", dict=dict)
            replypacket.code=5
            
            data_to_send=replypacket.ReplyPacket()
            self.request.sendto(data_to_send,self.client_address) # or send(data, flags)

    
class serve_auth(Thread):
        def __init__ (self,address, handler):
            self.address=address
            self.handler=handler
            Thread.__init__(self)

        def run(self):
            server = ThreadingTCPServer(self.address, self.handler)
            server.serve_forever()


server_auth = serve_auth(("10.20.3.111", 2224), handle_auth)
server_auth.start()
		    
server_acct = serve_auth(("10.20.3.111", 2225), handle_acct)
server_acct.start()