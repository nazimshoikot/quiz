import React from 'react';
import MixedResult from './MixedResult';

const MixedPageResult = ({route, navigation}) => {
  let quiz = route.params.quiz;
  let questions = JSON.parse(quiz.quiz_questions);
  console.log('Quiz in result:', quiz);
  return (
    <MixedResult
      arr={questions}
      isSaved={true}
      qualification={quiz.qualification}
      subject={quiz.subject}
      type={quiz.type}
    />
  );
};

export default MixedPageResult;
