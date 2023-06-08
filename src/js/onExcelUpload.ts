import {parse} from 'csv-parse/browser/esm';
import {getCodeToPaste} from "./codeToPase";
import {IExcelData, IMapStudentIdToScore} from "./types";

const alert = document.querySelector('.alert');

function getMapStudentIdToScore(data: IExcelData[]) {
  return data.reduce((prev: IMapStudentIdToScore, current: IExcelData) => {
    const [studentId] = current["Email Address"].split('@'); // Email Address
    const score = current["Total Sprint Review Score\n(formula)"];

    if (studentId && score) {
      prev[studentId] = parseInt(score);
    }

    return prev;
  }, {});
}

export function onExcelUpload(reader: FileReader) {
  parse(reader.result as string, {columns: true}, (err, data: any): void => {
    if (data && Array.isArray(data)) {
      const mapStudentIdToScore: Record<number, number> = getMapStudentIdToScore(data);

      const code = getCodeToPaste(mapStudentIdToScore);
      navigator.clipboard.writeText(code);

      alert.classList.add('show');

      setTimeout(() => {
        alert.classList.remove('show');
      }, 4000)

      document.querySelector('pre').innerHTML = code;
    }
  });
}