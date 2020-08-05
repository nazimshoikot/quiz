package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"strings"
)

type Question struct {
	Question      string
	A             string
	B             string
	C             string
	D             string
	Answer        string
	Category      string
	Guess         string
	Year          string
	Qualification string
	Subject       string
}

type YearWise struct {
	Year      string
	Questions []Question
}

func convertToJSON(filename string) {

	data, err := ioutil.ReadFile(filename)
	if err != nil {
		fmt.Println("Could not read file")
		return
	}
	// extract the qualification
	filename = strings.Split(filename, ".")[0]
	nameSplitArr := strings.Split(filename, "_")
	qualification := nameSplitArr[0]
	subject := nameSplitArr[1]

	// separate by year
	yearArr := strings.Split(string(data), "###")
	yearArr = yearArr[1:]

	// final array
	storedArray := make([]Question, 0)

	for _, item := range yearArr {
		str := item

		// find the two newlines and split into array of questions
		pattern := regexp.MustCompile(`(\r?\n){2}`)

		// split the questions into an array
		questionsArr := pattern.Split(str, -1)
		questionsArr = questionsArr[:len(questionsArr)-1]
		year := strings.Trim(questionsArr[0], "\r\n")
		questionsArr = questionsArr[1:]

		// write the json file
		questionsArray := make([]Question, 0)
		for _, question := range questionsArr {
			// split using new line
			qArr := strings.Split(question, "\r\n")
			if len(qArr) != 7 {
				fmt.Println("Number of fields in this question (should be 7): ", len(qArr))
				fmt.Println("Fields (separated by ','):")
				for _, item := range qArr {
					fmt.Print(item, ",")
				}
				fmt.Println()
			}

			// populate the fields
			ques := qArr[0]
			A := strings.Trim(qArr[1][2:], " ")
			B := strings.Trim(qArr[2][2:], " ")
			C := strings.Trim(qArr[3][2:], " ")
			D := strings.Trim(qArr[4][2:], " ")
			// fmt.Println("String raw ", qArr[5])
			Answer := strings.Trim(strings.Split(qArr[5], ":")[1], " ")
			// fmt.Println("Ans - ", Answer)
			// find category
			catIndex := strings.Index(qArr[6], ":")
			categ := strings.Trim(qArr[6][catIndex+1:], " ")

			var q Question
			q = Question{ques, A, B, C, D, Answer, categ, "", year, qualification, subject} // add answer later
			storedArray = append(storedArray, q)
			questionsArray = append(questionsArray, q)

			// fmt.Printf("%+v\n", q)

			// write the answers to json file

		}
		fmt.Println("Year:", year, ",", "Number of questions: ", len(questionsArray))
		// storedArray = append(storedArray, questionsArray)
		// var yearQuestions YearWise
		// yearQuestions = YearWise{year, questionsArray}
		// storedArray = append(storedArray, yearQuestions)

		// append to final arr

	}
	fmt.Println("Number of years recorded ", len(yearArr))
	fmt.Println("Total number of questions: ", len(storedArray))

	// fmt.Println("Array: ", storedArray)

	// write the questions array into json file
	// create a file and defer close it
	outfile := strings.Split(filename, ".")[0] + ".json"

	f, err := os.Create(outfile)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	// declare a buffered writer and write through the writer
	w := bufio.NewWriter(f)

	qJSON, err := json.Marshal(storedArray)
	if err != nil {
		fmt.Println("Error while marshaling json")
		return
	}
	msg := string(qJSON)
	w.WriteString(msg)

	// write the string
	w.Flush()
}

func formatTextFile(filename string) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		fmt.Println("Could not read file")
		return
	}
	// separate by year
	yearArr := strings.Split(string(data), "###")
	yearArr = yearArr[1:]

	outFile := strings.Split(filename, ".")[0] + "-format.txt"

	fullString := ""

	for _, item := range yearArr {
		str := item

		// find the two newlines and split into array of questions
		pattern := regexp.MustCompile(`(\r?\n){2}`)
		// fmt.Println(pattern.FindAllIndex([]byte(str), -1))

		// split the questions into an array
		questionsArr := pattern.Split(str, -1)
		questionsArr = questionsArr[:len(questionsArr)-1]
		// fmt.Println("Length: ", len(questionsArr))
		year := strings.Trim(questionsArr[0], "\r\n")
		questionsArr = questionsArr[1:]
		cnt := 0
		// string to write in new file
		fullString += "###\n" + string(year) + "\r\n\r\n"

		fmt.Println("Number of questions detected: ", len(questionsArr))

		for _, question := range questionsArr {
			// fmt.Println("question: ", question)
			// split using new line
			qArr := strings.Split(question, "\r\n")
			i := 0
			for {
				if strings.HasPrefix(qArr[i+1], "A ") {
					break
				}
				qArr[i] = qArr[i] + " " + qArr[i+1]
				qArr = append(qArr[:i+1], qArr[i+2:]...)
			}

			if len(qArr) != 6 {
				fmt.Println("Number of fields in this question (should be 6): ", len(qArr))
				fmt.Println("Fields (separated by ','):")
				for _, item := range qArr {
					fmt.Print(item, ",")
				}
				fmt.Println()
			} else {
				// add the two fields
				cnt++
				ans := "Answer: " + strings.Trim(qArr[5], " ")
				qArr = qArr[:5]
				qArr = append(qArr, ans)
				qArr = append(qArr, "Category: ")
			}

			for _, j := range qArr {
				fullString += j + "\r\n"
			}
			fullString += "\r\n"
		}
		fmt.Println("Number with total 8 fields fields: ", cnt)

		// write the file
		f, err := os.Create(outFile)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		w := bufio.NewWriter(f)
		_, err = w.WriteString(fullString)
		if err != nil {
			fmt.Println("could not write")
			return
		}

		w.Flush()
	}
}

func main() {

	if len(os.Args) < 2 || len(os.Args) > 3 {
		fmt.Println("Wrong format.\nUsage: go run main.go <filename> OR data <filename>")
		fmt.Println("Use the -format flag to format the text file. Example: data <filename> -format")
		return
	}

	if len(os.Args) == 3 {
		if os.Args[2] == "-format" {
			formatTextFile(os.Args[1])
		} else {
			fmt.Println("Wrong format.\nUsage: go run main.go <filename> OR data <filename>")
			fmt.Println("Use the -format flag to format the text file. Example: data <filename> -format")

		}
	} else {
		convertToJSON(os.Args[1])
	}

}
