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
	Question string
	A        string
	B        string
	C        string
	D        string
	Answer   string
	Category string
}

type YearWise struct {
	Year      string
	Questions []Question
}

func main() {

	if len(os.Args) != 2 {
		fmt.Println("Wrong format.\nUsage: go run main.go <filename> OR data <filename>")
		return
	}

	filename := os.Args[1]

	data, err := ioutil.ReadFile(filename)
	if err != nil {
		fmt.Println("Could not read file")
		return
	}
	// separate by year
	yearArr := strings.Split(string(data), "###")
	yearArr = yearArr[1:]

	// final array
	storedArray := make([]YearWise, 0)

	for _, item := range yearArr {
		str := item

		// find the two newlines and split into array of questions
		pattern := regexp.MustCompile(`(\r?\n){2}`)
		// fmt.Println(pattern.FindAllIndex([]byte(str), -1))

		// split the questions into an array
		questionsArr := pattern.Split(str, -1)
		questionsArr = questionsArr[:len(questionsArr)-1]
		fmt.Println("Length: ", len(questionsArr))
		year := strings.Trim(questionsArr[0], "\r\n")
		questionsArr = questionsArr[1:]
		// fmt.Println("Year: ", year)
		// fmt.Println("2nd: ", questionsArr[1])
		// fmt.Println("last: ", questionsArr[len(questionsArr)-1])

		// write the json file
		questionsArray := make([]Question, 0)
		for _, question := range questionsArr {
			// fmt.Println("question: ", question)
			// split using new line
			qArr := strings.Split(question, "\r\n")
			if len(qArr) != 7 {
				fmt.Println("Length of this arr: ", len(qArr))
				fmt.Println("Array:")
				for _, item := range qArr {
					fmt.Print(item, ",")
				}
				fmt.Println()
			}

			// populate the fields
			ques := qArr[0]
			A := qArr[1][2:]
			B := qArr[2][2:]
			C := qArr[3][2:]
			D := qArr[4][2:]
			// fmt.Println("String raw ", qArr[5])
			Answer := strings.Split(qArr[5], ":")[1]
			// fmt.Println("Ans - ", Answer)
			// find category
			catIndex := strings.Index(qArr[6], ":")
			categ := qArr[6][catIndex+1:]

			var q Question
			q = Question{ques, A, B, C, D, Answer, categ} // add answer later
			questionsArray = append(questionsArray, q)

			// fmt.Printf("%+v\n", q)

			// write the answers to json file

		}
		fmt.Println("Year:", year, ",", "Number of questions: ", len(questionsArray))
		var yearQuestions YearWise
		yearQuestions = YearWise{year, questionsArray}
		storedArray = append(storedArray, yearQuestions)
	}

	// fmt.Println("Array: ", storedArray)
	fmt.Println("Number of years recorded ", len(storedArray))

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

	// for _, item := range storedArray {

	qJSON, err := json.Marshal(storedArray)
	if err != nil {
		fmt.Println("Error while marshaling json")
		return
	}
	msg := string(qJSON)
	w.WriteString(msg)

	// }

	// write the string
	w.Flush()
}
