import json

def generate_data():
    # Replace with your actual data generation logic
    data = {
        'message': 'Hello from Python!',
        'value': 123
    }
    return data

def main():
    data = generate_data()
    with open('../public/output.json', 'w') as f:
        json.dump(data, f)

if __name__ == "__main__":
    main()
