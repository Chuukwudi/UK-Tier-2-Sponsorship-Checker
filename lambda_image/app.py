import httplib2
import json
import pandas as pd
from bs4 import BeautifulSoup, SoupStrainer
from functools import lru_cache

@lru_cache(maxsize=16)
def get_data():
    """
    The link to the Sponsor list  is updated. This function is designed to fetch the newest version
    """
    # Get webpage
    http = httplib2.Http()
    status, response = http.request('https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers')
    
    # Search for the link
    for link in BeautifulSoup(response, features="html.parser", parse_only=SoupStrainer('a')):
        if link.has_attr('href') and link['href'].startswith("https://assets.publishing.service.gov.uk/"):
            file_name = link['href'].split('/')[-1]
            print("\nLast updated:", file_name[:10])
            
            # Fetch the latest data, cache and use old data if there is no update
            df = pd.read_csv(link['href'])
                
    return df, file_name[:10]





def search(word, based_on=None, route=None):
    
    if based_on is None:
        based_on = "org"
    if route is None:
        route = "Skilled Worker"
    
    
    """
    based_on: Use "org", "toc" or "c" to search based on "Organisation Name", "Town/City" or "County" repectively. 
    word: This is the text to be searched
    route: Any of the elements present in data['Route'].unique(). default is "Skilled Worker".
    
    returns: A dataframe showing the results of the search.
    """
    # Fetch data
    data, last_updated = get_data()
    
    expand_arg = {'org': "Organisation Name", 'toc': "Town/City", 'c': "County"}
    column = expand_arg[based_on]
    df = data.dropna(subset=[column])
    sponsor = df[df[column].str.contains(word, case=False)]
    response = sponsor[sponsor["Route"] == route]
    
    return response.to_dict('records'), last_updated


def handler(event, context):
    """
    This function is designed to be used with AWS Lambda. 
    """
    
    data = json.loads(event["body"])
    
    output, last_updated = search(data["word"], data["based_on"], data["route"])
    
    
    response = {
        'statusCode': 200,
        'body': json.dumps({"last_updated": last_updated, "output_table": output}),
        "headers": {
            "Content-Type": "application/json",
        }
    }

    return response
    
event = {
    "body": "{\"word\": \"Teesside\", \"based_on\": \"org\", \"route\": \"Skilled Worker\"}"
}

print(handler(event, None))