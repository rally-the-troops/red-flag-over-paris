mode = None

list = []

x = y = w = h = 0
name = None

def flush():
	global x, y, w, h, name
	if mode == 'rect':
		list.append((x,y,w,h,'box',name))
	if mode == 'circle':
		x = cx - rx
		y = cy - ry
		w = rx * 2
		h = ry * 2
		list.append((x,y,w,h,'circle',name))
	x = y = w = h = 0
	name = None

for line in open("tools/boxes.svg").readlines():
	line = line.strip()
	if line == "<rect":
		flush()
		mode = 'rect'
		x = y = w = h = 0
	elif line == "<ellipse":
		flush()
		mode = 'circle'
		cx = cy = rx = ry = 0
	if line.startswith('x="'): x = round(float(line.split('"')[1]))
	if line.startswith('y="'): y = round(float(line.split('"')[1]))
	if line.startswith('width="'): w = round(float(line.split('"')[1]))
	if line.startswith('height="'): h = round(float(line.split('"')[1]))
	if line.startswith('cx="'): cx = round(float(line.split('"')[1]))
	if line.startswith('cy="'): cy = round(float(line.split('"')[1]))
	if line.startswith('rx="'): rx = round(float(line.split('"')[1]))
	if line.startswith('ry="'): ry = round(float(line.split('"')[1]))
	if line.startswith('inkscape:label="'): name = line.split('"')[1]
flush()

def print_list():
	print("const boxes = {")
	for (x,y,w,h,c,name) in list:
		print(f'"{name}": [{x},{y},{w},{h}],')
	print("}")

print_list()
