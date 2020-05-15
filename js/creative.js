function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function () {
	// MOBILE MENU
	var toggle = $("#toggle");

	$("#menu a").on("click", function () {
		console.log();
		if ($(window).width() < 790) {
			$("#toggle").click();
		}
	});

	toggle.on("click", function () {
		$(this).toggleClass("is-active");

		$("#menu").addClass("flex");
		$("#menu").toggleClass("slideInDown slideOutUp");
		$("body").toggleClass("overflow");
	});

	$("#preview-item").html(
		'<div id="inplayer-' +
			getParameterByName("id") +
			'" class="inplayer-paywall""></div>'
	);

	// ACCORDION
	$(".toggle").click(function (e) {
		e.preventDefault();
		let inner = $(this).next(".inner");

		if ($(this).hasClass("active")) {
			inner.removeClass("show");
			inner.slideUp(350);
			$(this).removeClass("active");
		} else {
			$(this).closest(".accordion").find("a.active").removeClass("active");
			$(this)
				.closest(".accordion")
				.find(".inner")
				.not(inner)
				.removeClass("show")
				.slideUp(350);
			inner.slideDown(350);
			inner.addClass("show");
			$(this).addClass("active");
		}
	});

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(".page-scroll").on("click", function (event) {
		var $anchor = $(this);
		$("html, body")
			.stop()
			.animate(
				{
					scrollTop: $($anchor.attr("href")).offset().top - 50,
				},
				250,
				"easeOutSine"
			);
		event.preventDefault();
	});

	// back to top button

	var offset = 550;
	var duration = 300;

	$(window).scroll(function () {
		if ($(this).scrollTop() > offset) {
			$(".back-to-top").fadeIn(duration);
		} else {
			$(".back-to-top").fadeOut(duration);
		}
	});

	$(".back-to-top").click(function (event) {
		event.preventDefault();

		$("html, body").animate({ scrollTop: 0 }, duration);
		return false;
	});

	// // DISPLAY SEARCH OVERLAY
	// $("#search").on("click", () => {
	// 	$("#js-search_container").css({ display: "block", opacity: "1" });
	// 	$(".nav_search").focus();
	// 	// $("#nav-wrapper").css({ z-index: "-5" });
	// });

	// // CLOSE SEARCH OVERLAY
	// $("#close").on("click", () => {
	// 	$("#js-search_container").css({ display: "none", opacity: "0" });
	// 	$(".nav_search").val("");
	// });

	// // SEARCH FUNCTIONALITY
	// function getSuggestions(val) {
	// 	$.get(
	// 		"https://services.inplayer.com/items/packages/99464/items?search[]=title:" +
	// 			val,
	// 		function (resp) {
	// 			var results = '<ul class="suggestions_ul nc">';
	// 			if (resp.total > 0) {
	// 				for (var i = 0; i < resp.collection.length; i++) {
	// 					results +=
	// 						'<li class="suggestion_item nc"><a class="nc" href="./item.html?id=' +
	// 						resp.collection[i].id +
	// 						'">' +
	// 						resp.collection[i].title +
	// 						"</a></li>";
	// 				}
	// 			} else {
	// 				results +=
	// 					'<li class="suggestion_item no_result">Sorry, no results found.</li>';
	// 			}
	// 			results += "<ul>";
	// 			$("#suggestion_wrapper").html(results);
	// 		}
	// 	);
	// }

	// var to = null;
	// $(".nav_search").on("keyup focus", function (e) {
	// 	var q = $(this).val();
	// 	if (q.length <= 2) {
	// 		$("#suggestion_wrapper").html("");
	// 		return;
	// 	}
	// 	clearTimeout(to);
	// 	to = setTimeout(function () {
	// 		getSuggestions(q);
	// 	}, 200);
	// });

	// $("body").on("click", (event) => {
	// 	var target = $(event.target);
	// 	if (!$(target[0]).hasClass("nc")) {
	// 		$("#suggestion_wrapper").html("");
	// 	}
	// });
});
