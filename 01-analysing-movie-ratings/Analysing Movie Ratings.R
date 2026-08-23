install.packages(c("rvest", "dplyr", "ggplot2"))
library (rvest)
library (dplyr)
library (ggplot2)


# 1. SCRAPE ---------------------------------------------------------------
# URL to save the file (Format: Web Page, Complete): 
# https://www.imdb.com/search/title/?title_type=feature&release_date=2026-01-01,2026-03-31&sort=num_votes,desc

page <- read_html("imdb.html")

# Titles (will include rank prefix e.g. "1. Project Hail Mary")
titles <- page %>% html_nodes("h3.ipc-title__text") %>% html_text()
titles <- titles[1:48] # we have trimmed to 48 films as 2 of the films are missing
# their metadata entirely (you can check using the length(),head() and tail() funcions)

# Rating and votes
rating <- page %>% html_nodes(".ipc-rating-star--rating")    %>% html_text()
rating <- rating[1:48]
votes  <- page %>% html_nodes(".ipc-rating-star--voteCount") %>% html_text()
votes  <- votes[1:48]
# Year, runtime, certificate — all in the same repeating list
meta        <- page %>% html_nodes(".ipc-inline-list__item") %>% html_text()
meta        <- meta[1:144]
year        <- meta[seq(1, 144, 3)]
runtime_raw <- meta[seq(2, 144, 3)]
certificate <- meta[seq(3, 144, 3)]

# Check what you got by typing the variable name
titles
rating
votes

# do all vectors have same length? 
length(titles)
length(rating)
length(votes)
length(year)

# Check the first and last few titles and years
head(titles)
tail(titles)
head(year)
tail(year)


# 2. BUILD DATA FRAME -----------------------------------------------------
movies_df <- data.frame(titles, year, runtime_raw,
                        certificate, rating, votes,
                        stringsAsFactors = FALSE)


# 3. CLEAN ----------------------------------------------------------------
movies_clean <- movies_df %>%
  mutate(rating = as.numeric(rating)) %>%
  mutate(votes  = as.numeric(gsub("[^0-9.]", "", votes)) *
           ifelse(grepl("K", votes), 1000, 1)) %>%
  mutate(titles  = sub("^[0-9]+\\. ", "", titles)) %>%
  filter(!is.na(rating), !is.na(votes))

glimpse(movies_clean)


# 4. VISUALISE ------------------------------------------------------------
ggplot(data = movies_clean,
      aes(x = votes, y = rating)) +
  geom_point(colour = "#D64045", alpha = 0.7) +
  geom_smooth(method = "lm", se = FALSE, colour = "grey40") +
  labs(
    title = "Do more-voted films rate higher?",
    x     = "Number of votes (log scale)",
    y     = "IMDb rating"
  ) +
  scale_x_log10() +
  theme_minimal()

ggsave("imdb_plot.png", width = 10, height = 6, dpi = 300)
