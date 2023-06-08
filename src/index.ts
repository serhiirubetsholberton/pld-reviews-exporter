import {parse} from 'csv-parse/browser/esm';
import './index.css';
import * as bootstrap from 'bootstrap';

var alertList = document.querySelectorAll('.alert');

alertList.forEach(function (alert) {
  new bootstrap.Alert(alert)
})

enum Specialization {
  FS = 'FS',
  ML = 'ML', // C18:ML
  ARVR = 'ARVR',
  LAB = 'LAB' // C19:LAB
}

enum EventStatus {
  PENDING = 'Pending'
}

interface Batch {
  id: number;
  full_name: string;
  name: string;
  number: any;
  school_location: {
    id: number;
    name: string;
  }
}

interface User {
  batch: Batch,
  full_name: string;
  id: number;
  picture_url: string;
  uri: string;
}

interface EventResponseDTO {
  id: number;
  score: number;
  status: EventStatus;
  uri: string;
  user: User
}

const alert = document.querySelector('.alert');


function onDrop(e: any): void {
  const reader = new FileReader();
  reader.onload = () => {
    parse(reader.result as string, {columns: true}, (err, data: any): void => {

      if (data && Array.isArray(data)) {
        const mapStudentIdToScore: Record<number, number> = data.reduce((prev, current) => {
          const [studentId] = current["Email Address"].split('@'); // Email Address
          const score = current["Total Sprint Review Score\n(formula)"];

          if (studentId && score) {
            prev[studentId] = parseInt(score);
          }

          return prev;
        }, {} as Record<number, number>);

        const code = `
          function sendScores(specId) { 
            const mapStudentIdToScore = ${JSON.stringify(mapStudentIdToScore)}
            const elementWrapper = document.querySelector("[data-react-class='events/score/Score']");
            try {
              const {csrfToken, eventRsvps} = JSON.parse(elementWrapper.getAttribute('data-react-props'))
              const mapStudentIdToData = eventRsvps.filter((event) => {
            
                return event.user.id in mapStudentIdToScore 
              }).reduce((prev, curr) => {
                prev[curr.user.id] = {
                  ...curr,
                }
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
                    "content-type": "application/json",
                    "sec-ch-ua": "\\"Google Chrome\\";v=\\"113\\", \\"Chromium\\";v=\\"113\\", \\"Not-A.Brand\\";v=\\"24\\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\\"macOS\\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",

                  },
                  "body": JSON.stringify({event_rsvp:{score: mapStudentIdToScore[id] }}), // mapStudentIdToScore[id]
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
        `;
        navigator.clipboard.writeText(code);

        alert.classList.add('show');

        setTimeout(() => {
          alert.classList.remove('show');
        }, 4000)

        document.querySelector('pre').innerHTML = code;
      }
    });
  };

  const csv = (e.target as HTMLInputElement).files[0];

  reader.readAsText(csv);
}


document.querySelector('#csv').addEventListener('change', onDrop);

