import '../index.css';
import {onExcelUpload} from "./onExcelUpload";

function onDrop(e: any): void {
  const reader = new FileReader();
  reader.addEventListener('load', () => onExcelUpload(reader));

  const csv = (e.target as HTMLInputElement).files[0];

  reader.readAsText(csv);
}


document.querySelector('#csv').addEventListener('change', onDrop);

