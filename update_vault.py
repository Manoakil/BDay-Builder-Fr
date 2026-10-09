import re

def update_vault():
    with open('v:\\Varsha\\frontend\\src\\pages\\VaultWishes.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    if 'import ScrollReveal' not in content:
        content = content.replace('function VaultWishes() {', 'import ScrollReveal from "../components/Birthday/ScrollReveal";\n\nfunction VaultWishes() {')

    parts = content.split('{started && (')
    if len(parts) > 1:
        started_block = parts[1]
        
        # Wrapping sections
        new_block = re.sub(r'(<section\b[^>]*>.*?</section>)', r'<ScrollReveal>\n            \1\n          </ScrollReveal>', started_block, flags=re.DOTALL)
        
        content = parts[0] + '{started && (' + new_block
        
    with open('v:\\Varsha\\frontend\\src\\pages\\VaultWishes.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_vault()
