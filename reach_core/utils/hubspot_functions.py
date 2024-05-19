import os
from hubspot import HubSpot
from typing import List, Dict, Any

async def process_hubspot_crm_objects(credentials: str) -> List[Dict[Any, Any]]:
    
    """Returned objects need to be ~unpacked~ with a to_dict() method."""

    api_client = HubSpot()
    api_client.access_token = credentials

    output_list = []

    try:
        if (all_contacts := api_client.crm.contacts.get_all()):
            output_list.extend([{'url': 'hubspot_contacts', 'raw_content': str(contact.to_dict())} for contact in all_contacts])
    except Exception as e:
        print(f"Failed to fetch contacts: {e}")

    try:
        if (all_companies := api_client.crm.companies.get_all()):
            output_list.extend([{'url': 'hubspot_companies', 'raw_content': str(company.to_dict())} for company in all_companies])
    except Exception as e:
        print(f"Failed to fetch companies: {e}")

    try:
        if (all_deals := api_client.crm.deals.get_all()):
            output_list.extend([{'url': 'hubspot_deals', 'raw_content': str(deal.to_dict())} for deal in all_deals])
    except Exception as e:
        print(f"Failed to fetch deals: {e}")

    try:
        if (all_tickets := api_client.crm.tickets.get_all()):
            output_list.extend([{'url': 'hubspot_tickets', 'raw_content': str(ticket.to_dict())} for ticket in all_tickets])
    except Exception as e:
        print(f"Failed to fetch tickets: {e}")
    
    try:
        if (all_dealsplits := api_client.crm.dealsplits.get_all()):
            output_list.extend([{'url': 'hubspot_dealsplits', 'raw_content': str(dealsplits.to_dict())} for dealsplits in all_dealsplits])
    except Exception as e:
        print(f"Failed to fetch tickets: {e}")

    try:
        if (all_feedback_submissions := api_client.crm.objects.feedback_submissions.get_all()):
            output_list.extend([{'url': 'hubspot_feedback_submissions', 'raw_content': str(feedback_submission.to_dict())} for feedback_submission in all_feedback_submissions])
    except Exception as e:
        print(f"Failed to fetch feedback submissions: {e}")

    try:
        if (all_goals := api_client.crm.objects.goals.get_all()):
            output_list.extend([{'url': 'hubspot_feedback_submissions', 'raw_content': str(goal.to_dict())} for goal in all_goals])
    except Exception as e:
        print(f"Failed to fetch feedback submissions: {e}")
    

    print(f"content: {output_list}")
    return output_list
