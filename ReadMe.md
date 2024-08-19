Зачем
Это подводящее задание, чтобы вы могли спроектировать приложение-чат, над которым вы будете работать позже. Ваша задача - разобраться с тем, для чего нужен Redux и как организовывать работу с данными (в т.ч. из сторонних систем) в приложении на базе Redux.
Задание:

Разработать структуру (структура, экшены, редьюсер) Redux store для приложения Чат. Структура должна позволять выполнять следующие операции:

получение списка сообщений
получение одного сообщения
отправка сообщения
получение списка пользователей
поиск по чату
Критерии приемки задания:

структура позволяет выполнять все действия выше
предусмотрены экшены для асинхронных событий (получение сообщений, отправка сообщений)
получение данных (список сообщений, список пользователей, поиск сообщений) оформлены в виде селекторов(простых и параметризованных)
код оформлен в PR
проходит проверки линтером (и тестами)
