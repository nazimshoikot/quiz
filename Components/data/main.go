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
}

func main() {
	data, err := ioutil.ReadFile("try.txt")
	if err != nil {
		fmt.Println("Could not read file")
		return
	}
	str := string(data)

	// find the two newlines and split into array of questions
	pattern := regexp.MustCompile(`(\r?\n){2}`)
	// fmt.Println(pattern.FindAllIndex([]byte(str), -1))

	// split the questions into an array
	questionsArr := pattern.Split(str, -1)
	fmt.Println("Length: ", len(questionsArr))

	// write the json file
	questionsArray := make([]Question, 0)
	for _, question := range questionsArr {
		fmt.Println("question: ", question)
		// split using new line
		qArr := strings.Split(question, "\r\n")
		fmt.Println("Array:")
		for _, item := range qArr {
			fmt.Print(item, ",")
		}
		fmt.Println()

		ques := qArr[0]
		A := qArr[1][2:]
		B := qArr[2][2:]
		C := qArr[3][2:]
		D := qArr[4][2:]

		fmt.Println("A: ", A)
		fmt.Println("D: ", D)

		var q Question
		q = Question{ques, A, B, C, D, ""} // add answer later
		questionsArray = append(questionsArray, q)

		// fmt.Printf("%+v\n", q)

		// write the answers to json file

	}
	fmt.Println("Number of questions: ", len(questionsArray))

	// write the questions array into json file
	// create a file and defer close it
	f, err := os.Create("try.json")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	// declare a buffered writer and write through the writer
	w := bufio.NewWriter(f)

	for _, item := range questionsArray {

		qJSON, err := json.Marshal(item)
		if err != nil {
			fmt.Println("Error while marshaling json")
			return
		}
		msg := string(qJSON) + "\n"
		w.WriteString(msg)

	}

	// write the string
	w.Flush()
}
