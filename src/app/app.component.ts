import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gtaimage';

  @Input() name: string | undefined;
  image: SafeUrl = "";

  constructor(private sanitizer: DomSanitizer) {}

  listFile = [
    {  }
  ]

  fileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
        return;
    }

    const file = input.files[0];
    console.log(file);
    var r = new FileReader();
    r.onload = (e) => {
      let byteArrayFile: Uint8Array = new Uint8Array(e.target?.result as any);
      let byteArray: Uint8Array = new Uint8Array(byteArrayFile.byteLength)
      let index: number = 0;
      const offset: number = 292;
      for(; offset + index < byteArrayFile.byteLength; index++) {
        byteArray[index] = byteArrayFile[offset + index];

        if(index >= 3) {
          if(byteArrayFile[offset + index - 1] == 255 && byteArrayFile[offset + index] == 217) {
            break;
          }
        }
      }

      
      byteArray = byteArray.slice(0, index + 1);
      this.image = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + _arrayBufferToBase64(byteArray));

    };
    r.readAsArrayBuffer(input.files[0]);
  }
}

function _arrayBufferToBase64( buffer: any ) {
  console.log(buffer);
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}
