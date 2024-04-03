FROM fluent/fluentd:v1.14-1
USER root
RUN gem update --system 3.2.3 && gem install bundler -v 2.4.22
# RUN ["gem", "install", "elasticsearch", "--no-document", "--version", "8.13.0"]
RUN ["gem", "install", "fluent-plugin-elasticsearch", "--no-document", "--version", "5.3.0"]
USER fluent

# # image based on fluentd v1.14-1
# FROM fluentd:v1.14-1
# # Use root account to use apk
# USER root
# # below RUN includes plugin as examples elasticsearch is not required# you may customize including plugins as you wish
# RUN apk add --no-cache --update --virtual .build-deps \
# sudo build-base ruby-dev \
# && gem uninstall -I elasticsearch \
# && gem install faraday-net_http -v 3.0.2 \
# && gem install faraday -v 2.8.1 \
# && gem install elasticsearch -v 8.13.0 \
# && sudo gem install fluent-plugin-elasticsearch \
# && sudo gem sources --clear-all \
# && apk del .build-deps \
# && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem
# # copy fluentd configuration from host image
# COPY ./config/fluent.conf /fluentd/etc/
# # copy binary start file
# COPY entrypoint.sh /bin/
# RUN chmod +x /bin/entrypoint.sh
# USER fluent