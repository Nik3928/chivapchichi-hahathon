from pathfinder import PF
from aiohttp import web

routes = web.RouteTableDef()

@routes.get('/')
async def main(request):
    with open('index.html','r',encoding="utf-8") as index:
        return web.Response(text=index.read(),content_type="text/html")

@routes.get('/src/index.js')
async def index_js(req):
    with open('src/index.js','r',encoding="utf-8") as index:
        return web.Response(text=index.read(),content_type="text/javascript")

@routes.get('/src/genFloorGrid.js')
async def genfloorgrid(req):
    with open('src/genFloorGrid.js','r',encoding="utf-8") as index:
        return web.Response(text=index.read(),content_type="text/javascript")

@routes.post('/pf')
async def pathfind(req):
    data = await req.json()
    for val in data:
        print(f"{val}: {data[val]}")
    source = f'{int(data["source"][0])}-{int(data["source"][1])}-{int(data["source"][2])}'
    receivers = []
    for rcv in data['receivers']:
        receivers.append(f'{int(rcv[0])}-{int(rcv[1])}-{int(rcv[2])}')
    paths = {}
    for cable in data['restrictedWalls']:
        paths[cable] = {}
        pfinder = PF(data['size'],data['heights'],data['restrictedWalls'][cable])
        for receiver in receivers:
            paths[cable][receiver] = {}
            paths[cable][receiver]['length'],paths[cable][receiver]['path'] = pfinder.find(source,receiver)
    return web.json_response(data=paths)
    

app = web.Application()
app.add_routes(routes)
web.run_app(app)