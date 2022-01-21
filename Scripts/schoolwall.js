/*
    获取并渲染学校墙
 */
$(function () {
    $.schoolwall = {
        //初始化
        init: function () {
            var that = this;
            $.ajax({
                url: rootPath + 'Login/GetSchoolList',
                dataType: 'Json',
                success: function (res) {
                    if (!res.HasError) {
                        var $items = that.render(res.Data);
                        if ($items) {
                            $("#div_SchoolList").append($items);
                            that.adjustWidth();
                        }
                    } else {
                        $("#div_SchoolList").html("");
                    }
                }
            });
            that.bindEvents();
        },

        //绑定事件
        bindEvents: function () {
            var that = this;
            $("#div_SchoolList").on('click', '.school-item', function () {
                var schoolId = $(this).data('schoolid');
                that.checkSchool(schoolId);
            });

            $(window).resize(function () {
                setTimeout(function () {
                    that.adjustWidth();
                }, 200);
            });
        },

        //渲染
        render: function (data) {
            var items = [];
            $.each(data, function (i, item) {
                $item = $('<div>').addClass('school-item').data('schoolid', item.ID);
                if (item.Valid) {
                    $item.addClass('checked');
                }

                var $img = $('<img>').attr('alt', 'Alternate Text').attr('src', item.SchoolBadge || 'https://static.k12top.com/Common/schoolDefaultBadge.png');
                var $logo = $('<div>').addClass('logo').append($img);
                var $name = $('<div>').addClass('name').text(item.Name);
                var $desc = $('<div>').addClass('school-desc').text(item.Description || '没有学校简介');
                $desc.attr('title', item.Description || '没有学校简介');
                var $left = $('<div>').addClass('left');
                var $right = $('<div>').addClass('right');
                $left.append($logo).append($name);
                $right.append($desc);
                $item.append($left).append($right);
                items.push($item);
            });

            return items;
        },

        //选中学校
        checkSchool(id) {
            var redirect = $("#div_SchoolList").data('redirect');
            $.ajax({
                url: rootPath + 'Login/CheckOtherSchool',
                data: { SchoolId: id },
                dataType: 'Json',
                success: function (res) {
                    if (!res.HasError) {
                        window.location.href = redirect || "/Home/Index";
                    } else {
                        window.location.href = "/Login/Index";
                    }

                }
            });
        },

        adjustWidth: function () {
            var prevWidth;
            var lastRowStart;
            $("#div_SchoolList").find('.school-item').removeAttr('style');
            $("#div_SchoolList").find('.school-item').each(function (idx, elem) {
                var curWidth = $(elem).width();
                if (idx > 0) {
                    if (curWidth < prevWidth - 3 || curWidth > prevWidth + 3) {
                        lastRowStart = idx;
                        return false;
                    }
                }

                prevWidth = curWidth;
            });

            if (lastRowStart) {
                for (var i = lastRowStart; i < $("#div_SchoolList").find('.school-item').length; i++) {
                    $("#div_SchoolList").find('.school-item:eq(' + i + ')').css('flex-grow', '0').css('flex-basis', prevWidth + 'px');
                }
            }
        }
    };

    $(function () {
        $.schoolwall.init();
    });
}(jQuery));
