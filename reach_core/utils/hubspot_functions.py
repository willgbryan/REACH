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
        print(f"Failed to fetch goals: {e}")

    try:
        if (all_calls := api_client.crm.objets.calls.get_all()):
            output_list.extend([{'url': 'hubspot_feedback_submissions', 'raw_content': str(call.to_dict())} for call in all_calls])
    except Exception as e:
        print(f"Failed to fetch calls: {e}")

    try:
        if (all_communications := api_client.crm.objects.communications.get_all()):
            output_list.extend([{'url': 'hubspot_feedback_submissions', 'raw_content': str(communication.to_dict())} for communication in all_communications])
    except Exception as e:
        print(f"Failed to fetch communications: {e}")
    
    try:
        if (all_emails := api_client.crm.objects.emails.get_all()):
            output_list.extend([{'url': 'hubspot_feedback_submissions', 'raw_content': str(email.to_dict())} for email in all_emails])
    except Exception as e:
        print(f"Failed to fetch emails: {e}")

    try:
        if (all_meetings := api_client.crm.objects.meetings.get_all()):
            output_list.extend([{'url': 'hubspot_feedback_submissions', 'raw_content': str(meeting.to_dict())} for meeting in all_meetings])
    except Exception as e:
        print(f"Failed to fetch meetings: {e}")

    try:
        if (all_notes := api_client.crm.objects.notes.get_all()):
            output_list.extend([{'url': 'hubspot_feedback_submissions', 'raw_content': str(note.to_dict())} for note in all_notes])
    except Exception as e:
        print(f"Failed to fetch notes: {e}")
    
    try:
        if (all_postal_mail := api_client.crm.objects.postal_mail.get_all()):
            output_list.extend([{'url': 'hubspot_feedback_submissions', 'raw_content': str(postal_mail.to_dict())} for postal_mail in all_postal_mail])
    except Exception as e:
        print(f"Failed to fetch postal_mail: {e}")

    try:
        if (all_tasks := api_client.crm.objects.tasks.get_all()):
            output_list.extend([{'url': 'hubspot_feedback_submissions', 'raw_content': str(task.to_dict())} for task in all_tasks])
    except Exception as e:
        print(f"Failed to fetch tasks: {e}")

    print(f"content: {output_list}")
    return output_list
