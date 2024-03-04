import json
from typing import List, Dict
from prompts import supervisor_prompt, first_step_prompt
from utils import send_request_to_gpt, get_openai_client

# this needs major work
from lats_proto_actor import main

client = get_openai_client("")

def create_next_context(
        # user_goal: str,
        # user_role: str,
        # plan: str,
        assistant_prompt: str,
        assistant_work: str,
) -> List[Dict[str, str]]:
    
    input_context=[
            # {"role": "user", "content": f"user_goal: {user_goal}"},
            # {"role": "user", "content": f"user_role: {user_role}"},
            # {"role": "user", "content": f"plan: {plan}"},
            {"role": "user", "content": f"assistant_prompt: {assistant_prompt}"},
            {"role": "user", "content": f"assistant_work: {assistant_work}"},
        ]
    
    return input_context

def get_plan(input_context: List[Dict[str, str]]) -> str:
    response = send_request_to_gpt(
        client,
        role_preprompt=first_step_prompt(),
        prompt="Create a plan to accomplish the user's goal.",
        context=input_context,
    )
    return response

def create_tasks(plan: str) -> List[str]:
    tasks = []
    lines = plan.split('\n')
    for line in lines:
        if line.strip().startswith('1.') or line.strip().startswith('2.') or \
           line.strip().startswith('3.') or line.strip().startswith('4.') or \
           line.strip().startswith('5.') or line.strip().startswith('6.'):
            tasks.append(line.strip())
    return tasks

def get_next_step(input_context: List[Dict[str, str]]) -> tuple:
    response = send_request_to_gpt(
        client,
        role_preprompt=supervisor_prompt(),
        prompt="Decide which action is most appropriate",
        context=input_context,
    )
    # Extracting the action and new prompt from the response
    action_to_take = None
    new_prompt = None
    if "Action to take:" in response:
        action_to_take, new_prompt_part = response.split('\n', 1)
        if "New prompt:" in response:
            new_prompt = new_prompt_part.strip().replace("New prompt: ", "")
    
    return action_to_take, new_prompt

def supervise_task(
        user_goal: str,
        user_role: str,
) -> str:

    # Initialize for storage:
    assistant_work_list = []

    plan_context = [
        {"role": "user", "content": f"user_goal: {user_goal}"},
        {"role": "user", "content": f"user_role: {user_role}"},
        ]

    # Create plan:
    plan = get_plan(plan_context)
    tasks = create_tasks(plan)
    print(tasks)
    print(plan)

    for task in tasks:

        # Reset for each task
        new_prompt = "not None"

        while new_prompt != "Accepted":

            assistant_work = main(task)

            step_context = create_next_context(
            # user_goal=user_goal,
            # user_role=user_role,
            assistant_prompt=task,
            assistant_work=assistant_work
            )

            action_to_take, new_prompt = get_next_step(step_context)
            if action_to_take == 'Accept the assistants current work.':
                assistant_work_list.append(assistant_work)
            else:
                assistant_work = main(new_prompt)
                print(action_to_take)
                print(new_prompt)

    return assistant_work_list


print(supervise_task('Perform a market analysis of the existing sea freight industry', 'product manager'))