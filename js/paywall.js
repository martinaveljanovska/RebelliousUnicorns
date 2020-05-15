function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var config_ip = {
	packages: [99464, 99465, 99466],
	service_url: "https://services.inplayer.com",
};

var paywall = new InplayerPaywall("bedf2948-3cda-441d-81f7-68017afeacc5", [
	{
		id: getParameterByName("id"),
	},
]);
$(".inplayer-paywall-logout").parent().hide();
paywall.on("authenticated", function () {
	$(".inplayer-paywall-login").parent().hide();
	$(".inplayer-paywall-logout").parent().show();
});

paywall.on("logout", function () {
	location.reload();
});

function createItemElement(assetId, assetPhoto, assetTitle) {
	var output =
		'<div class="package-item"><div class="content" style="background-image:url(' +
		assetPhoto +
		')">';
	output +=
		'<a href="./item.html?id=' +
		assetId +
		'" class="overlay-link"></a></div><div class="item-label"><div class="name">';
	output += assetTitle;
	output += "</div>";
	output += "</div></div>";
	return output;
}

$(function () {
	$("#preview-item").html(
		'<div id="inplayer-' +
			getParameterByName("id") +
			'" class="inplayer-paywall"></div>'
	);

	$(".inplayer-paywall-logout").parent().hide();

	paywall.on("authenticated", () => {
		$(".inplayer-paywall-logout").parent().show();
		$(".inplayer-paywall-login").parent().hide();
	});
	paywall.on("logout", function () {
		location.reload();
	});

	// PACKAGES CREATE
	var packageNumber = 0;
	config_ip.packages.forEach((package, i) => {
		$.get(config_ip.service_url + "/items/packages/" + package, (response) => {
			var packageTitle = response.title;
			$("#package-title-" + package).html(packageTitle);
			$("#title-" + package).html(packageTitle);
			$.get(
				config_ip.service_url +
					"/items/packages/" +
					package +
					"/items?limit=500",
				(response) => {
					var output = "";
					packageNumber++;

					for (let item of response.collection) {
						let asset = item,
							assetId = asset.id,
							assetPhoto = asset.metahash.paywall_cover_photo,
							assetTitle = asset.title;

						output += createItemElement(assetId, assetPhoto, assetTitle);

						document.getElementById(
							"package-items-" + package
						).innerHTML = output;
					} // for

					if (packageNumber >= config_ip.packages.length) {
						console.log(packageNumber);

						$(".carousel").slick({
							slidesToShow: 3,
							infinite: true,
							autoplay: true,
							autoplaySpeed: 5000,
							pauseOnHover: true,
							arrows: true,
							dots: true,
							responsive: [
								{
									breakpoint: 1150,
									settings: {
										slidesToShow: 3,
									},
								},
								{
									breakpoint: 920,
									settings: {
										slidesToShow: 2,
									},
								},
								{
									breakpoint: 610,
									settings: {
										slidesToShow: 1,
									},
								},
							],
						});
					} // if packageNumber
				}
			); // get items
		}); // get packages
	}); //for each
	// console.log(screen.width)
	// initSlider();

	// DISPLAY SEARCH OVERLAY
	$("#search").on("click", () => {
		$("#js-search_container").css({ display: "block", opacity: "1" });
		$(".nav_search").focus();
		// $("#nav-wrapper").css({ z-index: "-5" });
	});

	// CLOSE SEARCH OVERLAY
	$("#close").on("click", () => {
		$("#js-search_container").css({ display: "none", opacity: "0" });
		$(".nav_search").val("");
	});

	// SEARCH FUNCTIONALITY
	function getSuggestions(val) {
		$.get(
			"https://services.inplayer.com/items/packages/" +
				package +
				"/items?search[]=title:" +
				val,
			function (resp) {
				var results = '<ul class="suggestions_ul nc">';
				if (resp.total > 0) {
					for (var i = 0; i < resp.collection.length; i++) {
						results +=
							'<li class="suggestion_item nc"><a class="nc" href="./item.html?id=' +
							resp.collection[i].id +
							'">' +
							resp.collection[i].title +
							"</a></li>";
					}
				} else {
					results +=
						'<li class="suggestion_item no_result">Sorry, no results found.</li>';
				}
				results += "<ul>";
				$("#suggestion_wrapper").html(results);
			}
		); //get
	}

	var to = null;
	$(".nav_search").on("keyup focus", function (e) {
		var q = $(this).val();
		if (q.length <= 2) {
			$("#suggestion_wrapper").html("");
			return;
		}
		clearTimeout(to);
		to = setTimeout(function () {
			getSuggestions(q);
		}, 200);
	});

	$("body").on("click", (event) => {
		var target = $(event.target);
		if (!$(target[0]).hasClass("nc")) {
			$("#suggestion_wrapper").html("");
		}
	}); //end search functionality
});
