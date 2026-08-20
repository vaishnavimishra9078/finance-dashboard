document.querySelectorAll(".topicTab").forEach((btn) => {

    btn.addEventListener("click", () => {

        document
            .querySelectorAll(".topicSection")
            .forEach((section) => {
                section.style.display = "none";
            });

        document.getElementById(
            btn.dataset.target
        ).style.display = "block";

    });

});