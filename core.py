# coding=utf8
import sys,time,os,datetime
from SocketServer import ThreadingTCPServer
from SocketServer import StreamRequestHandler
from threading import Thread
import dictionary
import packet
import struct, tools
import corepacket
from utilites import in_period
#import paramiko
#paramiko.util.log_to_file('demo_simple.log')
# get host key, if we know one

#hostname='10.20.3.1'

#client=paramiko.SSHClient()
#client.load_system_host_keys()
#client.set_missing_host_key_policy(policy=paramiko.AutoAddPolicy())
#client.connect(hostname='10.20.3.1',port=22, username='dolphinik',password='Wind0za')

#stdin, stdout, stderr = client.exec_command('/user add name=mikrobill password=123 group=full')
#print stdin, stdout, stderr
#client.close()
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
    cur = conn.cursor()
except:
    print "I am unable to connect to the database"
    


dict=dictionary.Dictionary("dicts\dictionary","dicts\dictionary.microsoft")
t = time.clock()

class handle_auth(StreamRequestHandler):
    #def setup(self):
    #     sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
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
        cur.execute("""SELECT id, secret from nas_nas WHERE ipaddress='%s'""" % nasip)
        row = cur.fetchone()
        nas_id=str(row[0])
        secret=str(row[1])
        
            

        #nassecret=Nas.objects.get(ipaddress=nasip)


        ##Здесь нужно организовать проверку наличия в базе имени пользователя
        ##Если есть-подставляем в объект и ставим атрибут code=2, наче code=3
        replypacket=corepacket.CorePacket(secret=secret, dict=dict)
        
        #account=Account.objects.get(username=packetobject['User-Name'][0], ballance__gt=0)

        cur.execute("""SELECT bsa.username, bsa.password, bsa.ipaddress, (SELECT bat.tarif_id FROM billservice_accounttarif as bat WHERE bat.datetime<now() and bat.account_id=bsa.id ORDER BY datetime DESC LIMIT 1) as tarif_id, status, banned, ballance FROM billservice_account as bsa WHERE username='%s'""" % packetobject['User-Name'][0])

        row = cur.fetchone()
        username=''
        password=''
        ipaddress=''
        username  = row[0]
        password  = row[1]
        ipaddress = row[2]
        tarif_id  = row[3]
        status    = row[4]
        banned    = row[5]
        ballance  = row[6]
        
        cur.execute("""SELECT id from nas_nas WHERE id=(SELECT nas_id FROM billservice_accessparameters_nas WHERE accessparameters_id=(SELECT access_type_id FROM billservice_tariff WHERE id=%s))""" % tarif_id)
        row=cur.fetchone()

        #if int(row[0])==int(nas_id):
        nas_accept=True
        #else:
        #    nas_accept=False
        #print "nas_accept", nas_accept
        #cur.execute("""SELECT id, name, time_start, length, repeat_after FROM billservice_timeperiodnode WHERE id=(SELECT  timeperiodnode_id FROM billservice_timeperiod_time_period_nodes WHERE timeperiod_id=(SELECT access_time_id FROM billservice_tariff WHERE id='%s'))""" % tarif_id)
        #rows = cur.fetchall()
        #for row in rows:
        #    time_access=in_period(row[2],row[3],row[4])
        #    if time_access==True:
        #        break
        #print "time_access", time_access
        #Сделать проверку "как работает пользователь". В кредит или по предоплате
        #if packetobject['User-Name'][0]==username and time_access==True and nas_accept==True and status=='Enabled' and banned=='Disabled' and ballance>0:
        if True:
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
                account_id, sessionid, date_start, interrim_update,
                caller_id, called_id, nas_id, framed_protocol, checkouted_by_time, checkouted_by_trafic
                )
                VALUES ((SELECT id FROM billservice_account WHERE username=%s), %s, %s,%s, %s, %s, %s, 'PPTP', %s, %s);
                """, (packetobject['User-Name'][0], packetobject['Acct-Session-Id'][0], datetime.datetime.now(), datetime.datetime.now(), packetobject['Calling-Station-Id'][0], packetobject['Called-Station-Id'][0], packetobject['NAS-IP-Address'][0], False, False))
                

            if packetobject['Acct-Status-Type']==['Alive']:
                #sess=Session()
                #sess=Session.objects.get(sessionid=packetobject['Acct-Session-Id'][0])
                #sess.session_time=packetobject['Acct-Session-Time'][0]
                #sess.bytes_in=packetobject['Acct-Input-Packets'][0]
                #sess.bytes_out=packetobject['Acct-Output-Packets'][0]
                #sess.save()
                #cur.execute(
                #"""
                #UPDATE radius_session SET
                #interrim_update=%s, session_time=%s, bytes_in=%s, bytes_out=%s
                #WHERE
                #sessionid=%s;
                #""", (datetime.datetime.now(), packetobject['Acct-Session-Time'][0],packetobject['Acct-Input-Octets'][0], packetobject['Acct-Output-Octets'][0], packetobject['Acct-Session-Id'][0]))

                cur.execute(
                """
                INSERT INTO radius_session(
                account_id, sessionid, interrim_update,
                caller_id, called_id, nas_id, session_time,
                bytes_in, bytes_out, checkouted_by_time, checkouted_by_trafic)
                VALUES ( (SELECT id FROM billservice_account WHERE username=%s), %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s);
                """, (packetobject['User-Name'][0], packetobject['Acct-Session-Id'][0],
                      datetime.datetime.now(), packetobject['Calling-Station-Id'][0],
                      packetobject['Called-Station-Id'][0], packetobject['NAS-IP-Address'][0],
                      packetobject['Acct-Session-Time'][0],
                      packetobject['Acct-Input-Octets'][0], packetobject['Acct-Output-Octets'][0], False, False)
                )
                
            if packetobject['Acct-Status-Type']==['Stop']:
                #sess=Session()
                #sess=Session.objects.get(sessionid=packetobject['Acct-Session-Id'][0])
                #sess.session_time=packetobject['Acct-Session-Time'][0]
                #sess.bytes_in=packetobject['Acct-Input-Packets'][0]
                #sess.bytes_out=packetobject['Acct-Output-Packets'][0]
                #sess.date_end=datetime.datetime.now()
                #sess.save()
                #cur.execute(
                #"""
                #UPDATE radius_session SET
                #session_time=%s, bytes_in=%s, bytes_out=%s, date_end=%s
                #WHERE
                #sessionid=%s;
                #""", (packetobject['Acct-Session-Time'][0],packetobject['Acct-Input-Octets'][0], packetobject['Acct-Output-Octets'][0], datetime.datetime.now(), packetobject['Acct-Session-Id'][0]))
                now=datetime.datetime.now()
                cur.execute(
                """
                INSERT INTO radius_session(
                account_id, sessionid, interrim_update, date_end,
                caller_id, called_id, nas_id, session_time,
                bytes_in, bytes_out, checkouted_by_time, checkouted_by_trafic)
                VALUES ( (SELECT id FROM billservice_account WHERE username=%s), %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s);
                """, (packetobject['User-Name'][0], packetobject['Acct-Session-Id'][0],
                      now, now, packetobject['Calling-Station-Id'][0],
                      packetobject['Called-Station-Id'][0], packetobject['NAS-IP-Address'][0],
                      packetobject['Acct-Session-Time'][0],
                      packetobject['Acct-Input-Octets'][0], packetobject['Acct-Output-Octets'][0], False, False)
                )

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
            self.allow_reuse_address=True
            Thread.__init__(self)

        def run(self):
            server = ThreadingTCPServer(self.address, self.handler)
            server.serve_forever()


server_auth = serve_auth(("0.0.0.0", 2224), handle_auth)
server_auth.start()
		    
server_acct = serve_auth(("0.0.0.0", 2225), handle_acct)
server_acct.start()