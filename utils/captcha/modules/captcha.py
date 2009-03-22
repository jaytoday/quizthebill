"""
Captcha module

Captcha image generator
"""

__AUTHOR__ = 'Mateusz Banach'
__COPYRIGHT__ = 'Copyright (c) 2008 Mateusz Banach'
__LICENSE__ = 'MIT license'
__DATE__ = '31/10/2008'
__VERSION__ = '1.0'

try:
	import Image
	import ImageDraw
	import ImageFilter
	import ImageFont
except: raise Exception, 'This module requires PIL: http://www.pythonware.com/products/pil'

import math
import os
import re
from random import randint as R
from random import uniform as U

LOWER = 1
UPPER = 2
DIGITS = 4
ALL = 7

def captcha(font, file, length=6, size=40, mode=ALL, scale=0.75, angle=30, arcs=5, textcolor=None, backcolor=None, arccolor=None):
	"""
	Arguments:

	font: path to TTF font or directory containing TTF fonts; random one will be chosen;
	file: file-like object to save the output image to;
	length: number of characters in the text; [1, inf);
	size: size of the font used to render the text; [1, inf);
	mode: type of set of characters in the text (binary OR); LOWER | UPPER | DIGITS | ALL;
	scale: characters in the text will be scaled by random value between 1.0 and scale; (0.0, inf);
	angle: characters in the text will be rotated by random angle between -scale and scale degrees; [0, 180];
	arcs: number of arcs obscuring the output image; [0, inf);
	textcolor: Text color. None means random; [0x000000, 0xFFFFFF];
	backcolor: Background color. None means random; [0x000000, 0xFFFFFF];
	arccolor: Arc color. None means textcolor; [0x000000, 0xFFFFFF];

	Return value:

	Generated text;
	"""

	try:
		if os.path.isdir(font): dir = True
		else: dir = False
	except: raise Exception, 'Invalid font path'
	if dir:
		isfont = re.compile('^.+[Tt][Tt][Ff]$')
		try: fonts = filter(lambda file: isfont.match(file), os.listdir(font))
		except Exception, e: raise Exception, 'Unable to list font directory: ' + repr(e)
		if not fonts: raise Exception, 'No fonts found'
		else: font = os.path.join(font, fonts[R(0, len(fonts) - 1)])
	try:
		size = int(size)
		if size < 1: raise Exception
	except: raise Exception, 'Invalid font size'
	try: font = ImageFont.truetype(font, size)
	except: raise Exception, 'Invalid font file'
	try:
		length = int(length)
		if length < 1: raise Exception
	except: raise Exception, 'Invalid text length'
	try:
		mode = int(mode)
		if not 0 < mode < 8: raise Exception
	except: raise Exception, 'Invalid text mode'
	try:
		scale = float(scale)
		if scale <= 0.0: raise Exception
	except: raise Exception, 'Invalid text scale'
	try:
		angle = int(angle)
		if not 0 <= angle <= 180: raise Exception
	except: raise Exception, 'Invalid text angle'
	try:
		arcs = int(arcs)
		if arcs < 0: raise Exception
	except: raise Exception, 'Invalid arc count'
	if textcolor <> None:
		try:
			textcolor = int(textcolor)
			if not 0x000000 <= textcolor <= 0xFFFFFF: raise Exception
		except: raise Exception, 'Invalid text color'
	if backcolor <> None:
		try:
			backcolor = int(backcolor)
			if not 0x000000 <= backcolor <= 0xFFFFFF: raise Exception
		except: raise Exception, 'Invalid background color'
	if arccolor <> None:
		try:
			arccolor = int(arccolor)
			if not 0x000000 <= arccolor <= 0xFFFFFF: raise Exception
		except: raise Exception, 'Invalid arc color'
	if textcolor == None and backcolor == None:
		textcolor = R(0, 0xFFFFFF)
		backcolor = R(0, 0xFFFFFF)
		while math.fabs(textcolor - backcolor) < 0x323232:
			textcolor = R(0, 0xFFFFFF)
			backcolor = R(0, 0xFFFFFF)
	elif textcolor == None:
		textcolor = R(0, 0xFFFFFF)
		while math.fabs(textcolor - backcolor) < 0x323232: textcolor = R(0, 0xFFFFFF)
	elif backcolor == None:
		backcolor = R(0, 0xFFFFFF)
		while math.fabs(textcolor - backcolor) < 0x323232: backcolor = R(0, 0xFFFFFF)
	if arccolor == None: arccolor = textcolor
	lower = 'abcdefghijklmnopqrstuvwxyz'
	upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	digits = '123456789'
	chars = ''
	if mode == 1: chars = lower
	elif mode == 2: chars = upper
	elif mode == 4: chars = digits
	elif mode == 3: chars = lower + upper
	elif mode == 5: chars = lower + digits
	elif mode == 6: chars = upper + digits
	elif mode == 7: chars = lower + upper + digits
	chars = [chars[R(0, len(chars) - 1)] for char in xrange(length)]
	images = []
	width = 0
	height = 0
	for char in chars:
		w, h = font.getsize(char)
		s = U(1.0, scale)
		foreground = Image.new('RGB', (w, h), backcolor)
		ImageDraw.Draw(foreground).text((0,0), char, font=font, fill=textcolor)
		if s == 1.0: foreground = foreground.convert('RGBA')
		else: foreground = foreground.convert('RGBA').resize((int(w * s), int(h * s)))
		if angle: foreground = foreground.rotate(R(-angle, angle), expand=1)
		background = Image.new('RGB', foreground.size, backcolor)
		background.paste(foreground, foreground)
		w, h = background.size
		if h > height: height = h
		width += w
		images.append(background)
	height = int(height * 1.5)
	background = Image.new('RGB', (width, height), backcolor)
	x = 0
	for image in images:
		background.paste(image, (x, R(0, height - image.size[1] - 1)))
		x += image.size[0]
	draw = ImageDraw.Draw(background)
	w = int(width * 0.1)
	h = int(height * 0.1)
	for arc in xrange(arcs):
		x = R(0, width - 2 * w)
		y = R(0, height - 2 * h)
		draw.arc((x, y, R(x + w, width), R(y + h, height)), R(0, 360), R(0, 360), arccolor)
	try: background.filter(ImageFilter.EDGE_ENHANCE_MORE).save(file, format='PNG')
	except Exception, e: raise Exception, 'Unable to save image: ' + repr(e)
	return ''.join(chars)