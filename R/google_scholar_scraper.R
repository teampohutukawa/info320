### Scrape Google Scholar results using API ###

# Uses two queries and joins results.
# "misinformation+disinformation" and "misinformation+OR+disinformation"

# Limitations:
# api query limit:20/hr
# api server limit: 1000 results
# Need: 3 api keys per query or wait 1hr to use same 3 queries.



# Load functions below first.
# 1. Run Queries
# 2. Merge the two data results


# Load required packages
library(tidyverse)
library(httr)
library(jsonlite)
library(stringi)




# 1. Run Queries #

api_keys <- c("d3a477bf55bc6de6117b1594ecb14be482d1e096f31703678a375bc7708d2ea4",
              "9d8432205f7503682ec49e6678b266b9f5572ae2ce3133bb82d7187d7fb56b4f",
              "E4762962125c8205c3e31e232e5590451909c63124dd63b56531b4164a82659e",
              "487a44afcec93f92b0b3bd2a83aebc2f1268fba7f752b84e28e2ea0b02a4a0c4",
              "231a31101567a96b92e2ff71050e230d592355b6842c0600f08d98686fb2d8e8",
              "61d63d73de752472aba4e1173b2c5908693bc8815188970a74ee32c67263dbcf",
              "82aef7c8f882425c02267dcc9171adde2faff8fc6d8e895a5f6b8d13b1f48f88",
              "966de91af0488d31be0b8732882f5ee1738d80a269257c5856c86556c6e0e8bd",
              "23c50239cedead4d1cc3bf810cbf96fdc6d7e82ab31acc27164b832b0902feaf",
              "8658d4e94bbe5d397edf6f08e1b515ba212a6e7482537f6aed02bf85d45c1d98")


basic_url <- "https://serpapi.com/search.json?"
engine <- "google_scholar"
lang <- "en"
start <- 400
num <- "20"       #results per query
queries <- 20     # how many queries per api key


# Queries
query1 <- "misinformation+disinformation"
query2 <- "misinformation+OR+disinformation"

df_results <- do_query(api_keys, basic_url, engine, lang, start, num, queries, query1)
df_results2 <- do_query(api_keys, basic_url, engine, lang, start, num, queries, query2)



# 2. Merge the two data results #

# Unlist dataframes
names(df_results) <- c("df1_raw", "df1_enc")
list2env(df_results, envir = .GlobalEnv)

names(df_results2) <- c("df2_raw", "df2_enc")
list2env(df_results2, envir = .GlobalEnv)


# Find unmatched results and join
unmatch_data <- anti_join(df1_enc, df2_enc, by="result_id")
df3 <- bind_rows(df2_enc, unmatch_data)

# Remove duplicates
df_final <- df3[!duplicated(df3), ]


# Save as csv file
write.csv(df_final, paste0("results.csv"), row.names = FALSE)
# Save as json file
write_json(df_final, paste0("results.json"))






################### Functions ###################

# get_df_results: Creates a dataframe of the results of a given api query.
# input: String of api query.
# output: Dataframe of results.

get_df_results <- function(api_query){
  query_results <- GET(api_query)
  results <- httr::content(query_results)
  organic_results <- results$organic_results
  if (length(organic_results) == 0){
    stop("No more results")
  }
  
  df_results <- data.frame()
  
  for (i in 1:length(organic_results)){
    result_id <- organic_results[[i]]$result_id
    title <- organic_results[[i]]$title
    publ_info_summary <- organic_results[[i]]$publication_info$summary
    snippet <- organic_results[[i]]$snippet
    link <- organic_results[[i]]$link
    if (length(link) == 0){
      link <- organic_results[[i]]$resources$link
    }
    cited_by_total <- organic_results[[i]]$inline_links$cited_by$total
    
    result <- c(result_id, title, publ_info_summary, snippet, link, cited_by_total)
    if (length(result) != 6){
      next
    }
    df_results <- rbind(df_results, result)
    colnames(df_results) <- c("result_id", "title", "publ_info_summary", "snippet", "link", "cited_by_total")
  }
  return(df_results)
}




# get_enc_df: Creates a encoded dataframe.
# input: Dataframe to encode.
# output: Encoded Dataframe in utf-8.

get_enc_df <- function(df){
  df_new <- df %>%
    mutate(result_id = sapply(result_id, stri_enc_toutf8),
           title = sapply(title, stri_enc_toutf8),
           publ_info_summary = sapply(publ_info_summary, stri_enc_toutf8),
           snippet = sapply(snippet, stri_enc_toutf8),
           link = sapply(link, stri_enc_toutf8)
    ) %>% 
    separate(publ_info_summary, c("authors", "year", "site"), " - ", remove = FALSE) %>%
    mutate(year = as.integer(str_sub(year,-4,-1)),
           cited_by_total = as.integer(cited_by_total))
  
  return(df_new)
}




# do_query: Creates and saves csv and json files of queries.
# input: Query requirements:
# api_keys: list of api keys.
# basic_url: api link
# engine: what search engine.
# lang: what language
# start: <- results number to start at (0 recommended).
# num: results per query (max 20).
# queries: how many queries per api key (max 20).
# output: list containing dataframes of raw results and encoded/decoded results.

do_query <- function(api_keys, basic_url, engine, lang, start, num, queries, query){
  df_data <- data.frame()
  
  for (i in 1:length(api_keys)) { 
    api_key <- api_keys[i]
    
    for (q in 1:queries) {
      
      start <- as.character(start)
      print(start)
      
      final_url <- paste0(basic_url,
                          "engine=", engine,
                          "&q=", query,
                          "&hl=", lang,
                          "&start=", start,
                          "&num=", num,
                          "&api_key=", api_key
      )
      # update start from number
      start <- as.integer(start) + as.integer(num)
      
      # get results from query, add to dataframe
      df_new <- get_df_results(final_url)
      df_data <- rbind(df_data, df_new)
    }
  }
  
  
  # Save as csv file
  write.csv(df_data, paste0(query, ".csv"), row.names = FALSE)
  
  # Encode and Decode data
  df_data2 <- get_enc_df(df_data)
  
  # Save as json file
  write_json(df_data2, paste0(query, ".json"))
  
  return(list(df_raw = df_data, df_enc = df_data2))
  
}

###########################################################