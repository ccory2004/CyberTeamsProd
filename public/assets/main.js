function deleteTeamChange() {
  document.getElementById("deleteTeam")
    .action = "/teams/" + document.getElementById("deleteTeamSelect")
    .value;
}

function modifyTeamChange() {
  document.getElementById("modifyTeamGet")
    .action = "/teams/" + document.getElementById("modifyTeamGetSelect")
    .value;
}

function userTeamAddChange() {
  try {
    console.log(document.getElementById("userTeamAddUserSelect")
      .value);
    document.getElementById("userTeamAdd")
      .action = "/users/" + document.getElementById("userTeamAddUserSelect")
      .value;
  } catch {
    console.log("no user selected");
  }
}

function getTeam() {
  teamToModifyId = document.getElementById("modifyTeamSelectTeam")
    .value;
  fetch("/teams/" + teamToModifyId)
    .then(function(response) {
      return response.json();
    })
    .then(function(parsed) {
      try {
        document.getElementById("modifyTeam")
          .action = "/teams/" + teamToModifyId;
        document.getElementById("modifyTeamName")
          .value = parsed.teamName;
        document.getElementById("modifycpId")
          .value = parsed.cpId;
        document.getElementById("modifyCpUniqueCode")
          .value = parsed.cpUniqueCode;
        document.getElementById("modifyDivision")
          .value = parsed.division;
      } catch {
        console.log("error");
      }
    });
}

function filterRounds(RoundId, RoundName) {
  var users;
  var html = ``;
  fetch("/competition/" + RoundId)
    .then(function(response) {
      return response.json();
    })
    .then(function(parsed) {
      var test = true;
      html = html + `
          <h3>` + parsed.title + ` Competition Details</h3>
          <p>For the ` + parsed.division + ` division</p>
          <hr>
          <h4>Image Downloads</h4>
          `;
      if (parsed.imageNames != null) {
        for (i = 0; i < parsed.imageNames.length; i++) {
          html = html + `
            <div class="card">
              <h6 class="card-header">` + parsed.imageNames[i] + `</h6>
              <div class="card-body">
                <p class="card-text">Remeber to use WinMD5 to calculate the checksum, and match it to the one below!</p>
                <a href="` + parsed.imageLinks[i] + `" class="btn btn-primary">Click to Download</a>
                <p class="card-text">Checksum: ` + parsed.imageChecksums[i] + `</p>
              </div>
            </div>
            <br>
            `;
        }
      } else {
        html = html + `
          <p>This round is not available.</p>
          <p>It is available from ` + parsed.datePublish.toString() + ` to ` + parsed.dateRemove.toString() + `</p>
          `;
      }
      document.getElementById("memberView")
        .innerHTML = html;
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}

function exportUsers() {
  fetch("/users")
    .then(function(response) {
      return response.json();
    })
    .then(function(parsed) {
      const {
        Parser
      } = require('json2csv');
      const opts = {
        parsed
      };
      try {
        const parser = new Parser(opts);
        const csv = parser.parse(myData);
      } catch (err) {
        console.error(err);
      }
    });
}

function filterMembers(cpIdLook, TeamName) {
  var users;
  var html = "<h5>" + TeamName + " Team Members</h5><table class=\"table table-striped table-sm\"><thead><tr><th>Name</th><th>Email</th></tr></thead><tbody>";
  fetch("/users")
    .then(function(response) {
      return response.json();
    })
    .then(function(parsed) {
      var test = true;
      for (i = 0; i < parsed.length; i++) {
        user = parsed[i];
        var idOne = String(cpIdLook);
        var idTwo = String(user.cpId);
        if (idOne === idTwo) {
          test = false;
          html = html + "<tr><td>" + user.displayName +
            "</td><td>" + user.email + "</td></tr>";
        }
      }
      html = html + "</tbody></table></div>";
      if (test)
        html = "<p>There are no members in this team</p>"
      document.getElementById("memberView")
        .innerHTML = html;
    })
    .catch(function(error) {
      console.log("Error: " + error);
    });
}
function adminCheck() {
  fetch("/users/self")
    .then(function(response) {
      return response.json();
    })
    .then(function(parsed) {
      if (parsed.admin) {
        document.getElementById("adminClick").style.visibility = "visible";
      }
    })
}
function deleteRoundChange() {
  document.getElementById("deleteRound")
    .action = "/competition/" + document.getElementById("deleteRoundSelect")
    .value;
}