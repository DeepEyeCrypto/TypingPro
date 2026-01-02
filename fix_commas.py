
import re
import os

def fix_commas(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    lines = content.split('\n')
    new_lines = []
    
    # Simple line-by-line machine
    for i in range(len(lines)):
        line = lines[i]
        next_line = lines[i+1].strip() if i + 1 < len(lines) else ""
        
        trimmed = line.strip()
        
        # Check if line looks like a property: key: value
        # Pattern: starts with space, then key, then colon, then value, but no comma at end.
        if (':' in trimmed and 
            not trimmed.endswith(',') and 
            not trimmed.endswith('{') and 
            not trimmed.endswith('[') and
            not trimmed.endswith(';') and
            not trimmed.endswith('=>')):
            
            # If next line looks like another property OR next line starts with a closing brace (for array elements)
            # Actually, if it's followed by another property, add comma.
            if (':' in next_line or next_line.startswith('{')):
                # Special skip: if it is the VERY LAST property in an object (followed by closing brace), NO COMMA.
                # But wait, next line might be a property of a NEW object if the current object just closed?
                # No, if ':' is in next_line, it's another property.
                
                # Check if next line is a closing brace/bracket of the CURRENT scope
                if not next_line.startswith('}') and not next_line.startswith(']'):
                    line = line.rstrip() + ','
        
        # Special case for lesson objects in array
        if trimmed == '}' and next_line.startswith('{'):
            line = line.rstrip() + ','
            
        new_lines.append(line)
        
    new_content = '\n'.join(new_lines)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)

if __name__ == "__main__":
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                fix_commas(os.path.join(root, file))
