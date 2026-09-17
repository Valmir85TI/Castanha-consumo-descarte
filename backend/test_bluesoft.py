import httpx
import asyncio

async def test():
    url = "https://erp.bluesoft.com.br/castanha/api/comercial/produtos"
    headers = {
        "X-Customtoken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJ1c2VyTmFtZVwiOlwiY29uZWN0b1wiLFwic2VjcmV0XCI6XCJFQWtqcXpYSXZUUnBiZ0VOSEppWkVlSEZsYllzVGFJWVFxVE5ZTENxcEFcIn0ifQ.KO-UANmeKomNHhZUiSXMFT9rLh0iCTzxJvfzXIIE5F8x8g9848V6TxTUPcWS4YFeFY9Z-Jh4WECZ59CnRh89eQ"
    }
    
    # Try fetching by gtin to see if ?gtin= works
    params = {"gtin": "7891000000000"} # generic dummy barcode or just let's see if the parameter is accepted
    
    async with httpx.AsyncClient() as client:
        print("Sending request...")
        r = await client.get(url, headers=headers, params=params)
        print("Status", r.status_code)
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, dict):
                # Se for dict (provavelmente paginação ou objeto com meta), exibe as chaves e o primeiro item da lista ou dados
                print("Keys:", data.keys())
                for k, v in data.items():
                    if isinstance(v, list) and len(v) > 0:
                        print(f"First item of {k}:", v[0])
                    elif not isinstance(v, list):
                        print(f"{k}:", v)
            else:
                print(data[:1])
        else:
            print(r.text)

asyncio.run(test())
