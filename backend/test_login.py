import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        r = await client.post("http://localhost:8000/login", json={"usuario": "zzzzz", "pswd": "123"})
        print(r.status_code)
        print(r.text)

asyncio.run(test())
