import csv
import json

def read_csv(file_name):
    data = []
    with open(file_name, "r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data
            

def load_csv_data(data, file_name):
    years = data["years"]
    file_content = read_csv(file_name)
    for row in file_content:
        year = row["year"]
        if year not in years:
            years[year] = { "states": {} }
        states = years[year]["states"]

        state = row["state"]
        if state not in states:
            states[state] = { "candidates": {} }
        candidates = states[state]["candidates"]

        candidate = row["candidate"]
        candidate_votes = row["candidatevotes"]
        total_votes = row["totalvotes"]
        party = row["party_simplified"]
        percent_votes = round(int(candidate_votes) / int(total_votes) * 100, 2)
        if candidate not in candidates:
            candidates[candidate] = {
                "party": party,
                "votes": candidate_votes,
                "percentage": percent_votes
            }

        if "total_votes" not in states[state]:
            states[state]["total_votes"] = total_votes


def decorate_data(data):
    years = data["years"]

    for _, election in years.items():
        states = election["states"]
        for _, state_data in states.items():
            candidates = state_data["candidates"]

            most_votes = 0
            party = ""
            for _, candidate_data in candidates.items():
                votes = int(candidate_data["votes"])
                if votes > most_votes:
                    most_votes = votes
                    party = candidate_data["party"]
            state_data["winner"] = party

def main(args=None):
    data = { "years": {} }
    load_csv_data(data, "president.csv")
    decorate_data(data)

    json_data = json.dumps(data, indent=4)
    # TODO: Write data to js file
    out_file = open("president_data.js", "w")
    out_file.write("let PRESIDENT_DATA = ")
    out_file.write(json_data)
    out_file.close()




if __name__ == "__main__":
    main();