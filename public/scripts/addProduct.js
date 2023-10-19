let base64string = ""

async function imageUpload() {
    let file = document.querySelector('input[type="file"]')['files'][0]
    console.log(file);
    let reader = new FileReader()
    reader.onload = async function() {
        base64string = await reader.result.replace("data:", "")
            .replace(/^.+,/, "");
  
        imageBase64stringsep = base64string;
    }
    
    reader.readAsDataURL(file)

    setTimeout(function () {
        $('#encodedImage')[0].value = base64string
        // return true;
    }, 1000)
}