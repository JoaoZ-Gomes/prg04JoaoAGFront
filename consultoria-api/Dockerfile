FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests


RUN JAR_FILE=$(ls target/*.jar | head -n 1) && mv "$JAR_FILE" app.jar

CMD ["java", "-jar", "app.jar"]
