import pandas as pd
import os

def merge_columns(csv_path):
    # Check if the file exists
    if not os.path.isfile(csv_path):
        print(f"The file at path {csv_path} does not exist.")
        return

    # Read the CSV file
    df = pd.read_csv(csv_path)

    # Check if required columns exist
    if 'start_line' not in df.columns or 'end_line' not in df.columns:
        print("The required columns 'start_line' and 'end_line' do not exist in the CSV file.")
        return

    # Merge the columns with a hyphen
    df['merged'] = df['start_line'].astype(str) + '-' + df['end_line'].astype(str)

   

    # Remove duplicate rows based on technical_name, rule_name, and object_name
    df.drop_duplicates(subset=['technical_name', 'rule_name', 'object_name'], keep='first', inplace=True)

    # Save the modified dataframe to a new CSV file
    output_path = os.path.splitext(csv_path)[0] + '_merged.csv'
    df.to_csv(output_path, index=False)
    print(f"Merged CSV saved to {output_path}")

# Example usage
csv_path = 'C:\WORK_SampleCode\ED_Bookmark_template_Script\export1.csv'  # Replace with your CSV file path
merge_columns(csv_path)
