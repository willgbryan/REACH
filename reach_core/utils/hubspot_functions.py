import os
from hubspot import HubSpot
from typing import List, Dict, Any

async def process_hubspot_private_app(credentials: str) -> List[Dict[Any, Any]]:
    
    """Returned objects need to be ~unpacked~ with a to_dict() method."""

    api_client = HubSpot()
    api_client.access_token = credentials

    output_list = []

    # if (all_contacts := api_client.crm.contacts.get_all()):
    #     content.extend([contact.to_dict() for contact in all_contacts])
    # if (all_companies := api_client.crm.companies.get_all()):
    #     content.extend([company.to_dict() for company in all_companies])
    if (all_deals := api_client.crm.deals.get_all()):
        output_list.extend([{'url': 'hubspot_deals', 'raw_content': str(deal.to_dict())} for deal in all_deals])

    # if (all_tickets := api_client.crm.tickets.get_all()):
    #     content.extend([ticket.to_dict() for ticket in all_tickets])
    # if (all_feedback_submissions := api_client.crm.feedback_submissions.get_all()):
    #     content.extend([feedback_submission.to_dict() for feedback_submission in all_feedback_submissions])
    # if (all_invoices := api_client.crm.invoices.get_all()):
    #     content.extend([invoice.to_dict() for invoice in all_invoices])
    # if (all_payments := api_client.crm.payments.get_all()):
    #     content.extend([payment.to_dict() for payment in all_payments])
    # if (all_subscriptions := api_client.crm.subscriptions.get_all()):
    #     content.extend([subscription.to_dict() for subscription in all_subscriptions])


    print(f"content: {output_list}")
    return output_list

