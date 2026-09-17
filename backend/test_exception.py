import asyncio
import httpx

async def test():
    url = "https://erp.bluesoft.com.br/castanha/api/comercial/produtos"
    headers = {
        "X-Customtoken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJ1c2VyTmFtZVwiOlwiY29uZWN0b1wiLFwic2VjcmV0XCI6XCJFQWtqcXpYSXZUUnBiZ0VOSEppWkVlSEZsYllzVGFJWVFxVE5ZTENxcEFcIn0ifQ.KO-UANmeKomNHhZUiSXMFT9rLh0iCTzxJvfzXIIE5F8x8g9848V6TxTUPcWS4YFeFY9Z-Jh4WECZ59CnRh89eQ"
    }
    barcode = "7891000412855"

    async with httpx.AsyncClient() as client:
        print("Fetching...")
        r_gtin = await client.get(url, headers=headers, params={"gtin": barcode}, timeout=10.0)
        print(f"Status: {r_gtin.status_code}")
        print(f"Content: {r_gtin.text}")

asyncio.run(test())
