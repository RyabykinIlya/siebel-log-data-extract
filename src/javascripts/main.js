requirejs(['jquery', 'underscore', 'clipboard', 'papaparse'], function($, _, Clipboard, Papa) {
    //Added for Zomibie.js test
    window.matchMedia = window.matchMedia || function() {
        return {
            matches: false,
            addListener: function() {},
            removeListener: function() {}
        };
    };

    $(document).ready(function() {
        if (!(typeof(window.componentHandler) == 'undefined')) {
            window.componentHandler.upgradeAllRegistered();
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {} else {
            alert('The File APIs are not fully supported in this browser.');
        }

        var reader, content = [],
            csv = "";

        new Clipboard('#copy-button');
        new Clipboard('#copy-button-performance');
        new Clipboard('#copy-button-fdr');

        function ValidateSingleInput(oInput, validFileExtensions) {
            if (oInput.type == "file") {
                var sFileName = oInput.value;
                if (sFileName.length > 0) {
                    var blnValid = false;
                    for (var j = 0; j < validFileExtensions.length; j++) {
                        var sCurExtension = validFileExtensions[j];
                        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                            blnValid = true;
                            break;
                        }
                    }

                    if (!blnValid) {
                        alert("Sorry, file extension must be: " + validFileExtensions.join(", "));
                        oInput.value = "";
                        return false;
                    }
                }
            }
            return true;
        }

        function abortRead() {
            reader.abort();
        }

        function errorHandler(evt) {
            switch (evt.target.error.code) {
                case evt.target.error.NOT_FOUND_ERR:
                    alert('File Not Found!');
                    break;
                case evt.target.error.NOT_READABLE_ERR:
                    alert('File is not readable');
                    break;
                case evt.target.error.ABORT_ERR:
                    break;
                default:
                    alert('An error occurred reading this file.');
            };
        }

        function updateProgress(evt, elementId) {
            var progress = document.getElementById(elementId).getElementsByClassName("percent")[0];

            if (evt.lengthComputable) {
                var percentLoaded = Math.round((evt.loaded / evt.total) * 100);

                if (percentLoaded < 100) {
                    progress.style.width = percentLoaded + '%';
                    progress.textContent = percentLoaded + '%';
                }
            }
        }

        function handleFileSelect(evt) {
            var type = evt.data.type;
            var elementId = evt.data.elementId;
            var fileContentId = evt.data.fileContentId;
            var progress = document.getElementById(elementId).getElementsByClassName("percent")[0];

            if (evt.data.type == "log") {
                if (ValidateSingleInput(this, [".log"]) == false) return;
            } else {
                if (ValidateSingleInput(this, [".csv"]) == false) return;
            }

            progress.style.width = '0%';
            progress.textContent = '0%';
            reader = new FileReader();
            reader.onerror = errorHandler;
            reader.onprogress = updateProgress.call(this, evt, elementId);
            reader.onabort = function(e) {
                alert('File read cancelled');
            };
            reader.onloadstart = function(e) {
                document.getElementById(elementId).className = 'loading';
            };
            reader.onload = function(e) {
                progress.style.width = '100%';
                progress.textContent = '100%';
                setTimeout("document.getElementById('" + elementId + "').className='';", 2000);

                if (type == "log") {
                    //content = e.target.result;
                    // By lines
                    var lines = this.result.split('\n');
                    for (var l = 0; l < lines.length; l++) {
                        content.push(lines[l]);
                    }

                    $("#" + fileContentId).html(content[0] + " ...");
                } else {
                    csv = e.target.result;

                    $("#" + fileContentId).html(csv.substring(1, 100) + " ...");
                }
            }
            reader.readAsText(evt.target.files[0]);
            // Read in the image file as a binary string.
            //reader.readAsBinaryString(evt.target.files[0]);
        }

        function chk(e) {
            var c = e.data.c,
                s = e.data.s,
                f = e.data.f,
                o = "",
                x = [],
                outputId = "results_output";

            if (f == "ONLY_SBL_ERRS") {
                for (var el in c) {
                    for (var key in s) {
                        if (c[el].indexOf(s[key]) > -1) {
                            var i = c[el].indexOf(s[key]);
                            x.push(c[el].substring(i, i + 13));
                        }
                    }
                }
                x = _.uniq(x).sort();
            } else if (f == "ONLY_SBL_ERRS_WITH_DESC") {
                for (var el in c) {
                    for (var key in s) {
                        if (c[el].indexOf(s[key]) > -1) {
                            var i = c[el].indexOf(s[key]);
                            x.push(c[el].substring(i, c[el].length));
                        }
                    }
                }
                x = _.uniq(x).sort();
            } else if (f == "ONLY_BAD_SQL") {
                outputId = "results_output_performance";
                for (var el in c) {
                    for (var key in s) {
                        if (c[el].indexOf(s[key]) > -1) {
                            $.each(c[el].split(" "), function(i, e) {
                                if ((e.indexOf(".") > -1) && (parseInt(e.split(".")[0]) > 0)) {
                                    x.push(c[el]);
                                }
                            });
                        }
                    }
                }
            } else if (f == "ONLY_BAD_BS") {
                outputId = "results_output_performance";
                for (var el in c) {
                    for (var key in s) {
                        if (c[el].indexOf(s[key]) > -1) {
                            $.each(c[el].split(" "), function(i, e) {
                                if ((e.indexOf(".") > -1) && (parseInt(e.split(".")[0]) > 0)) {
                                    x.push(c[el]);
                                }
                            });
                        }
                    }
                }
            } else {
                for (var el in c) {
                    for (var key in s) {
                        if (c[el].indexOf(s[key]) > -1) {
                            x.push(c[el]);
                        }
                    }
                }
            }
            if (c.length > 0) {
                if (x.length > 0) {
                    $.each(x, function(i, e) {
                        o += x[i] + "&#13;&#10;";
                    });
                    $("#" + outputId).html(o);
                } else {
                    alert("No lines found !");
                }
            } else {
                alert("No file loaded !");
            }
        }

        function getFDRLastLines(e) {
            var h = ""
            var x = Papa.parse(csv, {
                header: true
            });
            x = x.data;
            x = _.sortBy(x, 'FdrID');
            var lastTwenty = x.slice(Math.max(x.length - 20, 1));
            for (var el in x) {
                h += x[el]["FdrID"] + " ";
                h += x[el]["ThreadID"] + " ";
                h += x[el]["AreaDesc"] + " ";
                h += x[el]["AreaSymbol"] + " ";
                h += x[el]["SubAreaDesc"] + " ";
                h += x[el]["SubAreaSymbol"] + " ";
                h += x[el]["UTC"] + " ";
                h += x[el]["UserInt1"] + " ";
                h += x[el]["UserInt2"] + " ";
                h += x[el]["UserStr1"] + " ";
                h += x[el]["UserStr2"] + "&#13;&#10;";
            }
            $("#results_output_fdr").html(h);
        }

        $('#files').change({
            elementId: "progress_bar",
            fileContentId: "file_content",
            type: "log"
        }, handleFileSelect);
        $('#files-performance').change({
            elementId: "progress_bar_performance",
            fileContentId: "file_content_performance",
            type: "log"
        }, handleFileSelect);
        $('#files-fdr').change({
            elementId: "progress_bar_fdr",
            fileContentId: "file_content_fdr",
            type: "csv"
        }, handleFileSelect);

        //AOM Log file buttons
        $("#check_js").on("click", {
            c: content,
            s: ["***MANIFEST_LOG*** Adding File: siebel/custom"],
            f: "",
        }, chk);
        $("#check_ev").on("click", {
            c: content,
            s: ["EventContext"],
            f: ""
        }, chk);
        $("#check_sbl").on("click", {
            c: content,
            s: ["SBL-"],
            f: "ONLY_SBL_ERRS"
        }, chk);
        $("#check_sbl_desc").on("click", {
            c: content,
            s: ["SBL-"],
            f: "ONLY_SBL_ERRS_WITH_DESC"
        }, chk);

        $("#check_ev_sbl").on("click", {
            c: content,
            s: ["EventContext", "SBL-"],
            f: ""
        }, chk);
        $("#check_errors").on("click", {
            c: content,
            s: ["error"],
            f: ""
        }, chk);

        //Performance buttons
        $("#lines_with_bad_sql").on("click", {
            c: content,
            s: ["seconds *****"],
            f: "ONLY_BAD_SQL"
        }, chk);
        $("#lines_with_bad_bs").on("click", {
            c: content,
            s: ["Execute Time:"],
            f: "ONLY_BAD_BS"
        }, chk);

        //FDR buttons
        $("#lines_before_crash").on("click", {
            c: csv
        }, getFDRLastLines);
    });
});