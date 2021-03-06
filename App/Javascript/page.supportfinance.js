$(document).ready(function () {
    $('.hotrotaichinh_tabs .next_btn_0').on('click', function () {
        $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
        $(".hotrotaichinh_tabs .content-tab").css("display", "none");
        $("#tab_hotrotaichinh_01").css("display", "block");
        $("a[href*='#tab_hotrotaichinh_01']").addClass("active");
    });
    $(".various").fancybox({});

    $(".selectSupport").on("click", function () {
        if (selectCarFirst()) {
            $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
            $(".hotrotaichinh_tabs .content-tab").css("display", "none");
            $("#tab_hotrotaichinh_02").css("display", "block");
            $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
            CalcFirstMoneyBefore();

            // add balloon or not?
            var selectCar = $(".checkCarTool:checked");
            var url = $(selectCar).data("url");
            var res = url.match(/hilux/g);
            if (res != null) { // is hilux
                var length = $("#ddlSupporProduct option[value='2']").length;
                if (length == 0) {
                    var opt = '<option value="2">Sản phẩm balloon</option>';

                    $("#ddlSupporProduct option[value='2']").remove();
                    $("#ddlSupporProduct").append(opt);

                    // enabled theo quy
                    $("#ddlPayMethod option[value='1']").removeAttr("disabled");

                    //$(".sp_balloon").css('opacity', "1");
                }

            } else { // not hilux
                $("#ddlSupporProduct option[value='2']").remove();

                // disabled theo quy
                $("#ddlPayMethod option[value='1']").attr("disabled", "");

                $(".sp_balloon").css('opacity', "0");
            }
            $("#ddlSupporProduct").material_select("destroy");
            $("#ddlPayMethod").material_select("destroy");
            $("#ddlSupporProduct").material_select();
            $("#ddlPayMethod").material_select();
        }
    });
    $(".complete").on("click", function () {
        if (selectCarFirst() && checkInput()) {
            $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
            $(".hotrotaichinh_tabs .content-tab").css("display", "none");
            $("#tab_hotrotaichinh_03").css("display", "block");
            $("a[href*='#tab_hotrotaichinh_03']").addClass("active");
            //var api = $("#hdApiUrl").val();
            var selectCar = $(".checkCarTool:checked");
            $(".nameOfCarSelectedTool").text($(selectCar).data("name"));
            $(".priceOfCarSelectedTool").text($(selectCar).data("price"));
            $(".imageOfCarSelectedTool").attr("src", $(selectCar).data("image"));

            //$(".spResultTitle").text($(selectCar).data("name"));
            //$(".spResultImage").attr("src", $(selectCar).data("image"));
            //$(".spResultPrice").text($(selectCar).data("price"));

            //var priceOfCar = parseFloat(RemoveAllPoint($(selectCar).data("price")));
            var priceOfCar = parseFloat(RemoveAllPoint($("#ddlMausac").val()));

            var accessoryPrice = parseFloat(RemoveAllPoint($("#txtAccessoryPrice").val() == "" || $("#txtAccessoryPrice").val() == "0" ?
                "0" :
                $("#txtAccessoryPrice").val()));
            var supportProduct = $("#ddlSupporProduct").val();
            var timeFor = parseInt($("#ddlTimeFor").val());
            var payMethod = $("#ddlPayMethod").val();
            var firstMoney = parseFloat(RemoveAllPoint($("#txtFirstMoney").val()));
            var numberOfMonths = 12 * timeFor;
            var ownPrice = (priceOfCar + accessoryPrice) - firstMoney;
            var ownPriceAverage = Math.floor(ownPrice / numberOfMonths); // tin dung trung binh

            var yearPercent = 6.99; // sp truyen thong

            //Kiểm tra nếu là xe Innova thì lãi suất 3.99% cho truyền thống
            var selectCar = $(".checkCarTool:checked");
            var url = $(selectCar).data("url");
            var res = url.match(/innova/g);
            if (res != null) {
                yearPercent = 3.99;
            }

            $(".spResultAccesoryPrice").text(formatMoney(accessoryPrice + ".000"));
            $(".spResultFirstPrice").text(formatMoney(firstMoney + ".000"));

            var timeFor = $("#ddlTimeFor").val();//Thời hạn
            var iPercentPrice = 15;
            if (timeFor > 3) {
                iPercentPrice = 20;
            }

            switch (supportProduct) {
                case '0': // sp truyen thong
                    var percentPrice = Math.floor((priceOfCar + accessoryPrice) * iPercentPrice / 100);
                    if (firstMoney < percentPrice) {
                        showErrorbyAlert('Hỗ trợ tài chính',
                            "<p>Số tiền trả trước tối thiểu là " + formatMoney(percentPrice + ".000") + "<p>",
                            "");
                        $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
                        $(".hotrotaichinh_tabs .content-tab").css("display", "none");
                        $("#tab_hotrotaichinh_02").css("display", "block");
                        $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
                        $(".complete").addClass("disabled");
                        $("#txtFirstMoney").focus();
                    } else {
                        $(".sp5050").css('display', "none");
                        $(".spBalloon").css('display', "none");
                        $(".spTruyenThong").css('display', "block");
                        var today = new Date();
                        var nextToday = payMethod == 1 ? getNextMonth(today) : 0;
                        var nextTwiceToday = payMethod == 1 ? getNextMonth(nextTwiceToday) : 0;
                        var numberOfMonth = getNumberOfDays(today.getFullYear(), today.getMonth() + 1);
                        //var numberOfMonth2 = payMethod == 1 ? getNumberOfDays(nextToday.getFullYear(), nextToday.getMonth() + 1) : 0;
                        //var numberOfMonth3 = payMethod == 1 ? getNumberOfDays(nextTwiceToday.getFullYear(), nextTwiceToday.getMonth() + 1) : 0;
                        var monthPercent = payMethod == 1 ? yearPercent / 12 * 3 : yearPercent / 12;

                        var result1 = Math.floor(ownPrice * (monthPercent / 100)); // Tien lai


                        //console.log("ownPrice:" + ownPrice);
                        //console.log("monthPercent:" + monthPercent);
                        //console.log("result1:" + result1);

                        //var result1 = (Math.floor(ownPrice * (monthPercent / 100)) * numberOfMonth) / 30; // Tien lai
                        //var result11 = (ownPrice * (monthPercent / 100) * numberOfMonth2) / 30; // Tien lai thang ke tiep
                        //var result12 = (ownPrice * (monthPercent / 100) * numberOfMonth3) / 30; // Tien lai thang thu 3

                        var result = result1 + ownPriceAverage;
                        //if (payMethod == 1)
                        //result = result11 + result12 + (ownPriceAverage * 3);
                        //result = result1 + result11 + result12 + (ownPriceAverage * 3);
                        //result = (result1 * 3) + ownPriceAverage;

                        //result = result / timeFor;

                        $(".spPriceTotal").text(formatMoney(result + ".000"));
                        $("#spOwnPrice").text(formatMoney(ownPrice + ".000"));
                    }
                    break;
                case '1': // sp 50/50
                    $(".spTruyenThong").css('display', "none");
                    $(".spBalloon").css('display', "none");
                    $(".sp5050").css('display', "block");
                    yearPercent = 7.99; // sp 50 / 50

                    //var monthPercent2 = yearPercent / 12;
                    var perHaftPrice = Math.floor((priceOfCar + accessoryPrice) / 2);
                    if (firstMoney < perHaftPrice) {
                        showErrorbyAlert("Hỗ trợ tài chính", "Số tiền trả trước tối thiểu là " + formatMoney(perHaftPrice + ".000"), "");
                        $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
                        $(".hotrotaichinh_tabs .content-tab").css("display", "none");
                        $("#tab_hotrotaichinh_02").css("display", "block");
                        $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
                        $(".complete").addClass("disabled");
                    } else {
                        // Tong tien 12 thang
                        //var day = new Date();
                        //var total = 0;
                        //for (var i = 1; i <= 12; i++) {
                        //    var dayNumber = getNumberOfDays(day.getFullYear(), day.getMonth() + 1);

                        //    //var rst = (ownPrice * (monthPercent2 / 100) * dayNumber) / 30; // Tien lai
                        //    var rst = (ownPrice * (monthPercent2 / 100) * dayNumber) / 30; // Tien lai
                        //    total += rst;
                        //    day = getNextMonth(day);
                        //}
                        //var ret = total + ownPrice;
                        var ret = Math.floor(ownPrice * yearPercent / 100) + ownPrice;


                        //if (ret > 0) {
                        $(".spPriceTotal5050").text(formatMoney(ret + ".000"));
                        //} else {
                        //    showErrorbyAlert("Hỗ trợ tài chính", "Số tiền trả trước vượt quá mức tài chính!", "");
                        //    $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
                        //    $(".hotrotaichinh_tabs .content-tab").css("display", "none");
                        //    $("#tab_hotrotaichinh_02").css("display", "block");
                        //    $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
                        //}
                    }
                    break;
                case '2': //sp balloon
                    yearPercent = 6.99;
                    var percentPrice = Math.floor((priceOfCar + accessoryPrice) * iPercentPrice / 100);
                    if (firstMoney < percentPrice) {
                        showErrorbyAlert('Hỗ trợ tài chính',
                            "<p>Số tiền trả trước tối thiểu là " + formatMoney(percentPrice + ".000") + "<p>",
                            "");
                        $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
                        $(".hotrotaichinh_tabs .content-tab").css("display", "none");
                        $("#tab_hotrotaichinh_02").css("display", "block");
                        $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
                        $(".complete").addClass("disabled");
                        $("#txtFirstMoney").focus();
                    } else {
                        var finalSetem = parseFloat(RemoveAllPoint($("#txtFinalSeptem").val() == "" ? "0" : $("#txtFinalSeptem").val()));
                        var finalSeptemMax = Math.floor((priceOfCar + accessoryPrice) * 0.3);

                        if (finalSetem <= 0) {
                            showErrorbyAlert('Hỗ trợ tài chính',
                                "<p>Vui lòng nhập số tiền trả cuối kỳ<p>",
                                "");
                            $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
                            $(".hotrotaichinh_tabs .content-tab").css("display", "none");
                            $("#tab_hotrotaichinh_02").css("display", "block");
                            $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
                            $(".complete").addClass("disabled");
                            $("#txtFinalSeptem").focus();
                        } else {
                            if (finalSeptemMax < finalSetem) {
                                showErrorbyAlert('Hỗ trợ tài chính', "<p>Tiền gốc trả cuối kì tối đa là <p>" + formatMoney(finalSeptemMax + ".000"), "");
                                $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
                                $(".hotrotaichinh_tabs .content-tab").css("display", "none");
                                $("#tab_hotrotaichinh_02").css("display", "block");
                                $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
                                $(".complete").addClass("disabled");
                                return false;
                            } else {
                                $(".spTruyenThong").css('display', "none");
                                $(".sp5050").css('display', "none");
                                $(".spBalloon").css('display', "block");


                                var tien_lai = (ownPrice * (yearPercent / 100)) / 12; // Theo thang
                                if (payMethod == 1) { // Theo ky
                                    yearPercent = 7.49;
                                    tien_lai = (ownPrice * (yearPercent / 100)) / 12;
                                    tien_lai = tien_lai * 3;
                                }

                                var goc_dinhky = Math.floor((ownPrice - finalSetem) / numberOfMonths);
                                var tra_dinhky = tien_lai + goc_dinhky;
                                $(".spPriceTotalBalloon").text(formatMoney(tra_dinhky + ".000"));

                                $("#spOwnPrice").text(formatMoney(ownPrice + ".000"));
                            }
                        }

                    }
                    break;
                default:
                    break;
            }


            $(".btnSendEmail").parent().removeClass("disabled-button");
            // Analytics function
            var isCan = checkCanGetAPost("ciSupportFinanceCountperDay");
            if (isCan) {
                postUserClickTools($(selectCar).data("idcar"), "HOTROTAICHINH");
            }
        }
    });
    $(".btnDownloadFiles").on("click", function () {
        ClickDownloadFileSupportFinance();
    })
    $('.priceInputMask').mask("###.###.###.###.###", { reverse: true });

    $("#ddlSupporProduct").on("change", function () {
        var val = $(this).val();
        switch (val) {
            case '0':
                $("#ddlTimeFor").find("option").not("option[value='0']").removeAttr("disabled");
                $(".spHinhThucThanhToan,.spThoiHanVay").css("opacity", 1);
                $(".spHinhThucThanhToan,.spThoiHanVay").css("pointer-events", 'all');
                $('select').material_select();
                $("#spClassPercentFirtMoney").text("(15%)");

                $(".sp_balloon").css("opacity", "0");
                break;
            case '1':
                $("#ddlTimeFor").find("option").not("option[value='1']").attr("disabled", "disabled");
                $("#ddlTimeFor option[value='1']").attr("selected", "selected");
                $(".spHinhThucThanhToan,.spThoiHanVay").css("opacity", 0.6);
                $(".spHinhThucThanhToan,.spThoiHanVay").css("pointer-events", 'none');
                $('select').material_select();
                $("#spClassPercentFirtMoney").text("(50%)");

                $(".sp_balloon").css("opacity", "0");
                break;
            case '2':
                $("#ddlTimeFor").find("option").removeAttr("disabled");
                $(".spHinhThucThanhToan,.spThoiHanVay").css("opacity", 1);
                $(".spHinhThucThanhToan,.spThoiHanVay").css("pointer-events", 'all');
                $('select').material_select();

                $(".sp_balloon").css("opacity", "1");
                break;
            default:
                $(".sp_balloon").css("opacity", "0");
                break;
        }
        CalcFirstMoneyBefore();
    });
    $("#ddlTimeFor").on("change", function () {
        var val = $(this).val();
        if (val > 0 && val <= 3) {
            $("#spClassPercentFirtMoney").text("(15%)");
        }
        else {
            $("#spClassPercentFirtMoney").text("(20%)");
        }
        CalcFirstMoneyBefore();
    });

    $("#frmsendMailHoTroTaiChinh").on("submit", function (event) {
        event.preventDefault();
    });
    if ($(".checkCarTool:checked").length > 0) {
        var obj = $(".checkCarTool:checked");
        //$(".spResultImage").attr("src", $(obj).data("image"));
        $(".spResultTitle").text($(obj).data("name"));
        $(".spResultPrice").text($(obj).data("price"));
        var idNew = $(obj).data("idcar");
        LoadColor(idNew);

        $(".selectSupport").click();
        //CalcFirstMoneyBefore();
    }
    $("#txtAccessoryPrice").on("keyup", function () {
        CalcFirstMoneyBefore();
    });
    console.log('1')
    ClickDownloadFileSupportFinance();
    console.log('2')
    checkCarToolSupportFinance();

    $("#ddlMausac").on("change", function () {
        var val = $(this).val();
        $(".spResultPrice").text(FormatNumber(val));
        $(".colorOfCarSelectedTool").text($("#ddlMausac option:selected").text());
        var img = $("#ddlMausac option:selected").data("img");
        //alert(img);
        $(".spResultImage").attr("src", img);
        CalcFirstMoneyBefore();
    });
});

function CalcFirstMoneyBefore() {
    var timeFor = $("#ddlTimeFor").val();//Thời hạn
    var iPercentPrice = 15;
    if (timeFor > 3) {
        iPercentPrice = 20;
    }

    var selectCar = $(".checkCarTool:checked");
    //var priceOfCar = parseFloat(RemoveAllPoint($(selectCar).data("price")));
    var price = $("#ddlMausac").val();
    if (price == null) price = "0";
    var priceOfCar = parseFloat(RemoveAllPoint(price));
    $(".colorOfCarSelectedTool").text($("#ddlMausac option:selected").text());

    var accessoryPrice = parseFloat(RemoveAllPoint($("#txtAccessoryPrice").val() == "" || $("#txtAccessoryPrice").val() == "0" ? "0" : $("#txtAccessoryPrice").val()));
    var supportProduct = $("#ddlSupporProduct").val();
    var firstMoney = 0;
    var ownPrice = (priceOfCar + accessoryPrice) - firstMoney;
    if (supportProduct == 1) {
        var perHaftPrice = Math.floor((priceOfCar + accessoryPrice) / 2);
        $("#txtFirstMoney").attr("placeholder", "Tối thiểu " + formatMoney(perHaftPrice + ".000"));
    } else {
        var percentPrice = Math.floor((priceOfCar + accessoryPrice) * iPercentPrice / 100);
        $("#txtFirstMoney").attr("placeholder", "Tối thiểu " + formatMoney(percentPrice + ".000"));
    }

    var finalSeptem = Math.floor((priceOfCar + accessoryPrice) * 0.3);
    $("#txtFinalSeptem").attr("placeholder", "Tối đa " + formatMoney(finalSeptem + ".000"));
}

function checkCarToolSupportFinance() {
    $(".checkCarTool").on("click", function (e) {
        $(".checkCarTool:checked").not(this).prop("checked", "");
        $(this).prop("checked", true);
        if ($(".checkCarTool:checked").length > 0) {
            $(".selectSupport").removeClass("disabled");
            $(".complete").removeClass("disabled");
        } else {
            $(".selectSupport").addClass("disabled");
            $(".complete").addClass("disabled");
        }
        //$(".spResultImage").attr("src", $(this).data("image"));
        $(".spResultTitle").text($(this).data("name"));
        $(".spResultPrice").text($(this).data("price"));

        var idNew = $(this).data("idcar");
        LoadColor(idNew);

        $(".selectSupport").click();
    });
}

function LoadColor(idNew) {
    var api = $("#hdApiUrl").val();
    var awesomeToyota = $("#hd__ToyotaDealerProject").val();
    $.ajax({
        url: api + "/api/Detail/GetColorProductById?idNew=" + idNew,
        type: "GET",
        headers: {
            'Authorization': 'X-XSRF-Token ' + awesomeToyota,
            'X-XSRF-Token': awesomeToyota,
            'Content-Type': 'application/json'
        },
        success: function (data) {
            var colorid = parseInt($("#hdColorId").val());

            $("#ddlMausac").html("");
            var str = '';
            //str += '<option disabled selected value="">Màu sắc</option>';
            $.each(data, function (i, item) {
                if (colorid > 0) {
                    var selected = '';
                    if (colorid == item.id) {
                        selected = 'selected';
                        $(".spResultPrice").text(FormatNumber(item.neW_CL_PRICE));
                        $(".spResultImage").attr("src", "/data/news/" + idNew + "/color/" + item.neW_CL_IMG + "?width=500");
                    }
                } else {
                    if (i == 0) {
                        $(".spResultPrice").text(FormatNumber(item.neW_CL_PRICE));
                        $(".spResultImage").attr("src", "/data/news/" + idNew + "/color/" + item.neW_CL_IMG + "?width=500");
                    }
                }
                str += '<option ' + selected + ' data-img="/data/news/' + idNew + '/color/' + item.neW_CL_IMG + '?width=500" value="' + item.neW_CL_PRICE + '" data-id="' + item.id + '">' + item.neW_CL_TITLE + '</option>';
            });
            $("#ddlMausac").html(str);
            $("#ddlMausac").material_select();
            CalcFirstMoneyBefore();
        }
    });
}

function selectCarFirst() {
    if ($(".checkCarTool:checked").length === 0) {
        showErrorbyAlert('Hỗ trợ tài chính', "<p>Vui lòng chọn trước 1 phiên bản xe!<p>", "");
        //$(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
        //$(".hotrotaichinh_tabs .tab_lg_content .content-tab").css("display", "none");
        //$('ul.tabs').tabs('select_tab', 'tab_hotrotaichinh_01');
        $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
        $(".hotrotaichinh_tabs .content-tab").css("display", "none");
        $("#tab_hotrotaichinh_01").css("display", "block");
        $("a[href*='#tab_hotrotaichinh_01']").addClass("active");
        $(".selectSupport").addClass("disabled");
        $(".complete").addClass("disabled");
        return false;
    }
    return true;
}

function checkInput() {
    var selectCar = $(".checkCarTool:checked");
    var priceOfCar = parseFloat(RemoveAllPoint($(selectCar).data("price")));
    var accessoryPrice = parseFloat(RemoveAllPoint($("#txtAccessoryPrice").val() == "" ? "0" : $("#txtAccessoryPrice").val()));
    var firstMoney = parseFloat(RemoveAllPoint($("#txtFirstMoney").val()));
    var ownPrice = (priceOfCar + accessoryPrice) - firstMoney;

    //var percentPrice = (priceOfCar + accessoryPrice) * 10 / 100;

    if (accessoryPrice > priceOfCar) {
        showErrorbyAlert('Hỗ trợ tài chính', "<p>Giá phụ kiện không vượt quá tiền xe!<p>", "");
        $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
        $(".hotrotaichinh_tabs .content-tab").css("display", "none");
        $("#tab_hotrotaichinh_02").css("display", "block");
        $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
        $(".complete").addClass("disabled");
        $("#txtFirstMoney").focus();
        return false;
    }
    if ($("#txtFirstMoney").val() === "") {
        showErrorbyAlert('Hỗ trợ tài chính', "<p>Vui lòng nhập số tiền trả trước!<p>", "");
        $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
        $(".hotrotaichinh_tabs .content-tab").css("display", "none");
        $("#tab_hotrotaichinh_02").css("display", "block");
        $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
        $(".complete").addClass("disabled");
        $("#txtFirstMoney").focus();
        return false;
    }
    if (ownPrice < 0) {
        showErrorbyAlert('Hỗ trợ tài chính', "<p>Quý khách đã nhập quá số tổng giá trị xe và phụ kiện, vui lòng nhập lại!<p>", "");
        $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
        $(".hotrotaichinh_tabs .content-tab").css("display", "none");
        $("#tab_hotrotaichinh_02").css("display", "block");
        $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
        $(".complete").addClass("disabled");
        $("#txtFirstMoney").focus();
        return false;
    }
    //if (firstMoney < percentPrice) {
    //    showErrorbyAlert('Hỗ trợ tài chính', "<p>Số tiền trả trước tối thiểu là " + formatMoney(percentPrice + ".000") +"<p>", "");
    //    $(".hotrotaichinh_tabs .tab").find("a").removeClass("active");
    //    $(".hotrotaichinh_tabs .content-tab").css("display", "none");
    //    $("#tab_hotrotaichinh_02").css("display", "block");
    //    $("a[href*='#tab_hotrotaichinh_02']").addClass("active");
    //    $(".complete").addClass("disabled");
    //    $("#txtFirstMoney").focus();
    //    return false;
    //}
    return true;
}

function RemoveAllPoint(str) {
    return str.replace(/\./g, "");
}

function getNumberOfDays(year, month) {
    return moment(year + "-" + month, "YYYY-MM").daysInMonth();
}

function getNextMonth(today) {
    var m = moment(today);
    //m.add(1, 'days');
    m.add(1, 'months');
    return m.toDate();
}
function ClickDownloadFileSupportFinance() {
    $("#panelEstimate").css("display", "block");
    $("#panelStatus_Estimate").text("Đang tạo chi tiết bảng tính...");
    var priceOfCar = parseFloat(RemoveAllPoint($("#ddlMausac").val()));

    var accessoryPrice = parseFloat(RemoveAllPoint($("#txtAccessoryPrice").val() == "" || $("#txtAccessoryPrice").val() == "0" ?
        "0" :
        $("#txtAccessoryPrice").val()));
    var sumOfPrice = priceOfCar + accessoryPrice;
    var supportProduct = $("#ddlSupporProduct").val();
    var timeFor = parseInt($("#ddlTimeFor").val()) * 12; // so thang
    var payMethod = $("#ddlPayMethod").val();
    var firstMoney = parseFloat(RemoveAllPoint($("#txtFirstMoney").val()));
    var ownPrice = (priceOfCar + accessoryPrice) - firstMoney;
    var type = 0;
    var balloon = parseFloat(RemoveAllPoint($("#txtFinalSeptem").val() == "" ? "0" : $("#txtFinalSeptem").val()));

    switch (supportProduct) {
        case '0': // sp truyen thong
            type = payMethod; // 0: theo thang, 1: theo quy
            break;
        case '1': // sp 50/50
            type = 4;
            break;
        case '2': // sp balloon
            type = parseInt(payMethod) + 2; // (0+2) 2: theo thang, (1+2) 3: theo quy
            break;
    }

    //Kiểm tra nếu là xe Innova thì tải file riêng
    var selectCar = $(".checkCarTool:checked");
    var url = $(selectCar).data("url");
    var res = url.match(/innova/g);
    if (res != null) {
        type = parseInt(payMethod) + 5;// (0+5) 5: theo thang, (1+5) 6: theo quy
    }

    var t = {
        iTypeFile: type,
        sSoTienMuaXe: sumOfPrice,
        sSoTienVay: ownPrice,
        sThoiGianVay: timeFor,
        Balloon: balloon
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/export-files-estimate',
        data: JSON.stringify(t),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (returnValue) {
            $("#panelStatus_Estimate").text("Bảng tính đã được tạo thành công, đang tải về...");
            setTimeout(function () {
                window.open('http://www.toyota.com.vn'+returnValue, '_parent');
                $("#panelEstimate").css("display", "none");
            }, 1000);

        }
    });
}
