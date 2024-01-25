const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");

const { PDFDocument, rgb, degrees } = PDFLib;

const capitalize = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
        match.toUpperCase()
    );
submitBtn.addEventListener("click", async() => {
    const val = capitalize(userName.value);
    const isNamePresent = await checkNamePresence(val);
    if (isNamePresent) {
        if (val.trim() !== "" && userName.checkValidity()) {
            generatePDF(val);
        } else {
            userName.reportValidity();
        }
    } else {
        alert("don't be smart buddy. Please enter a valid name.");
    }
});

const checkNamePresence = async(name) => {
    const nameListResponse = await fetch("./name.txt");
    const nameListText = await nameListResponse.text();
    const names = nameListText.split("\n").map((line) => line.trim().toLowerCase());
    return names.includes(name.toLowerCase());
};

const generatePDF = async(name) => {
    const existingPdfBytes = await fetch("./cert.pdf").then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch("./Sanchez-Regular.ttf").then((res) => res.arrayBuffer());
    const SanChezFont = await pdfDoc.embedFont(fontBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    firstPage.drawText(name, {
        x: 300,
        y: 270,
        size: 58,
        font: SanChezFont,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    console.log("Done creating");
    var file = new File([pdfBytes], "codev_certificate.pdf", {
        type: "application/pdf;charset=utf-8",
    });
    saveAs(file);
};