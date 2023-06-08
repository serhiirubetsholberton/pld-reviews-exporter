import {IMapStudentIdToScore} from "./types";

export function getCodeToPaste(mapStudentIdToScore: IMapStudentIdToScore) {
  return `
  function sendScores(specId) { 
    const mapStudentIdToScore = ${JSON.stringify(mapStudentIdToScore)}
    const elementWrapper = document.querySelector("[data-react-class='events/score/Score']");
    try {
      const {csrfToken, eventRsvps} = JSON.parse(elementWrapper.getAttribute('data-react-props'))
      const mapStudentIdToData = eventRsvps.filter((event) => event.user.id in mapStudentIdToScore).reduce((prev, curr) => {
        prev[curr.user.id] = { ...curr }
        return prev;
      }, {});
      
      sendRequests(mapStudentIdToData, csrfToken);
    } catch (e) {
      console.log(e);
    }
  
    function sendRequests(data, csrfToken) {
      Object.entries(data).forEach(([id, student]) => {
        fetch(\`https://intranet.hbtn.io\${student.uri}\`, {
          "headers": {
            "x-csrf-token": csrfToken,
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9,ru;q=0.8",
            "content-type": "application/json"
           
          },
          "body": JSON.stringify({event_rsvp:{score: mapStudentIdToScore[id] }}),
          "method": "PATCH",
          "referrer": "https://intranet.hbtn.io/events/4648/scores",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "mode": "cors",
          "credentials": "include"
        }).then(r => r.json()).then(({ user }) => {
          console.log(\`Score for student id \${user.id} - \${user.full_name} was changed successfully\`)
        });
      })
    }
  };
  
  sendScores()
`
}