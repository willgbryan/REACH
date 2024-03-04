import json
from typing import List, Dict
from prompts import supervisor_prompt, first_step_prompt
from utils import send_request_to_gpt, get_openai_client

# this needs major work
from lats_proto_actor import main

client = get_openai_client("")

def create_next_context(
        user_goal: str,
        user_role: str,
        assistant_prompt: str,
        assistant_work: str,
) -> List[Dict[str, str]]:
    
    input_context=[
            {"role": "user", "content": f"user_goal: {user_goal}"},
            {"role": "user", "content": f"user_role: {user_role}"},
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
        if line.strip().startswith('1') or line.strip().startswith('2') or \
           line.strip().startswith('3') or line.strip().startswith('4') or \
           line.strip().startswith('5') or line.strip().startswith('6') or \
           line.strip().startswith('7') or line.strip().startswith('8') or \
           line.strip().startswith('9'):
            tasks.append(line.strip())
    return tasks

def get_next_step(input_context: List[Dict[str, str]]) -> tuple:
    response = send_request_to_gpt(
        client,
        role_preprompt=supervisor_prompt(),
        prompt="Decide which action is most appropriate",
        context=input_context,
    )

    print(response)
    # Extracting the action and new prompt from the response
    new_prompt = response
    if "New prompt:" in response:
        new_prompt = new_prompt.strip().replace("New prompt: ", "")

    return new_prompt

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
    print(plan)
    print(tasks)

    for task in tasks:
        # init for first step
        new_prompt = "New prompt"

        # assistant evaluation
        while "New prompt" in new_prompt:

            assistant_work = main(f'YOUR TASK:{task} Existing work: {assistant_work_list}')

            step_context = create_next_context(
            user_goal=user_goal,
            user_role=user_role,
            assistant_prompt=task,
            assistant_work=assistant_work
            )

            new_prompt = get_next_step(step_context)
        
        assistant_work_list.append(assistant_work)

    return assistant_work_list


print(supervise_task('which nfl team has the best chance at winning the superbowl next year', 'team strategist'))