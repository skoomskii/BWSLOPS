window.onload = function () {
    document.getElementById("download")
        .addEventListener("click", () => {
            const report = this.document.getElementById("report");
            var opt = {
                margin: 1,
                filename: 'Receipt.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
            };
            html2pdf().from(report).set(opt).save();
        });
};