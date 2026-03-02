const uploadForm = document.getElementById("uploadForm");

const uploadVideo = async () => {
  const myFiles = document.getElementById("myVideo").files;

  const formData = new FormData();

  Object.keys(myFiles).forEach((key) => {
    formData.append(myFiles.item(key).name, myFiles.item(key));
  });

  if (myFiles.length != 0) {
    var uploadingContainer = document.getElementById("hero");
    if ((uploadingContainer.style.display = "block")) {
      uploadingContainer.style.display = "none"; // Hide the section
    }
    var waitingContainer = document.getElementById("waiting-container");
    if ((waitingContainer.style.display = "none")) {
      waitingContainer.style.display = "flex"; // Show the section
    }
  }

  const response = await fetch("/sfe-rs/applicant/upload-video", {
    method: "POST",
    body: formData,
  });
  const personalityTraits = await response.json();

  waitingContainer.style.display = "none";
  uploadingContainer.style.display = "block";

  if (!response.ok || personalityTraits.status !== "success") {
    const msg = personalityTraits.message || "Upload or analysis failed.";
    alert(msg);
    return;
  }

  try {
    var uploadingPartition = document.getElementById("uploading-partition");
    var analysisPartition = document.getElementById("analysis-partition");

    uploadingPartition.style.display = "none";
    analysisPartition.style.display = "block";

    // google.charts.load("current", { packages: ["bar"] });
    // google.charts.setOnLoadCallback(drawChart);

    // function drawChart() {
    //   var data = google.visualization.arrayToDataTable([
    //     ["Personality Traits", "Percentage %ㅤㅤ"],
    //     ["Openness", personalityTraits.openness],
    //     ["Conscientiousness", personalityTraits.conscientiousness],
    //     ["Extraversion", personalityTraits.extraversion],
    //     ["Agreeableness", personalityTraits.agreeableness],
    //     ["Neuroticism", personalityTraits.neuroticism],
    //   ]);

    //   var options = {
    //     animation: {
    //       duration: 2000,
    //       easing: "out",
    //       colors: ["#3498db"],
    //     },
    //   };

    //   var chart = new google.charts.Bar(document.getElementById("chart"));
    //   chart.draw(data, google.charts.Bar.convertOptions(options));
    // }

    var chartData = {
      header: ["#", "Percentage %"],
      rows: [
        ["Openness", personalityTraits.openness],
        ["Conscientiousness", personalityTraits.conscientiousness],
        ["Extraversion", personalityTraits.extraversion],
        ["Agreeableness", personalityTraits.agreeableness],
        ["Neuroticism", personalityTraits.neuroticism],
      ],
    };
    var chart = anychart.radar();
    chart.defaultSeriesType("area");
    chart.data(chartData);
    chart.palette(["#009cea", "#9BC53DE6", "#64B5F6BF"]);
    chart.yAxis().stroke("#545f69");
    chart.yAxis().ticks().stroke("#545f69");
    chart.xGrid().stroke({
      color: "#545f69",
      thickness: 0.5,
      dash: "10 5",
    });

    chart.yGrid().palette(["gray 0.05", "gray 0.025"]);
    chart.yScale().minimum(0);
    chart.yScale().ticks().interval(10);
    chart.interactivity().hoverMode("by-x");
    chart.markerPalette(["star5"]);
    chart
      .tooltip()
      .displayMode("union")
      .useHtml(true)
      .format(function (e) {
        console.log(this);
        return (
          '<span style="color:' +
          this.series.color() +
          '">' +
          this.seriesName +
          ": " +
          this.value +
          "</span>"
        );
      });
    chart.legend().align("center").position("center-bottom").enabled(true);
    chart.container("radarChart");
    chart.draw();

    // var header2 = document.getElementById("header2");
    // header2.style.marginBottom = "0px";
  } catch (error) {
    console.error(error);
    alert("Could not display results. Check the console.");
  }
};

uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  uploadVideo();
});
