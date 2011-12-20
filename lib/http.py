# -*- coding: utf-8 -*-
# $Id: http.py 1395 2008-08-22 09:24:49Z dmitry $

from django.http import HttpResponse
from django.utils import simplejson
from django.shortcuts import render_to_response
from django.template import RequestContext
from decimal import Decimal
from datetime import datetime
class MyJSONEncoder(simplejson.JSONEncoder):
    """JSON encoder which understands decimals."""

    def default(self, obj):
        '''Convert object to JSON encodable type.'''
        if isinstance(obj, Decimal):
            return "%d" % obj
        elif isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        else:
            print type(obj)
            return simplejson.JSONEncoder.default(self, obj)
    
def render_response(request, tmpl, output):
    return render_to_response(tmpl, output, context_instance=RequestContext(request))

class JsonResponse(HttpResponse):
    """
    HttpResponse descendant, which return response with ``application/json`` mimetype.
    """
    def __init__(self, data):
        super(JsonResponse, self).__init__(content=simplejson.dumps(data,ensure_ascii=False, cls = MyJSONEncoder), mimetype='application/json')
