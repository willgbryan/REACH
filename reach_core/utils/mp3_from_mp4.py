import os
from moviepy.editor import *

async def mp4_to_mp3(mp4_file_name: str) -> str:
    base_file_name = mp4_file_name.rsplit('.', 1)[0]
    FILETOCONVERT = AudioFileClip(mp4_file_name)
    mp3_output_path = f"uploads/{base_file_name}.mp3"
    FILETOCONVERT.write_audiofile(mp3_output_path)
    FILETOCONVERT.close()

    return f"MP3 available at {mp3_output_path}"
