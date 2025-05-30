import { Arrow } from "@/components/arrow";
import { Separator } from "@/components/separator";
import Layout from "../layout";
import { months } from "@/utils/constants";
import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PassengerInputs from "@/components/PassengerInputs";
import { useCartStore } from "@/store/cartStore";
import { useCities } from "@/hooks/useCities";

export default function BookingPage() {
  const router = useRouter();

  const cartData = useCartStore().getCart();

  if (!cartData) {
    return (
      <Layout>
        <div className="text-center mt-10">
          <p className="text-lg font-semibold">Корзина пуста</p>
          <p className="text-gray-500">Пожалуйста, выберите рейс перед бронированием.</p>
        </div>
      </Layout>
    );
  }

  // const [firstName, setFirstName] = useState<string>("");
  // const [lastName, setLastName] = useState<string>("");
  // const [birthday, setBirthday] = useState<string>("");
  // const [passportSeries, setPassportSeries] = useState<string>("");
  // const [passportNumber, setPassportNumber] = useState<string>("");

  // const firstNameError = !/^[a-zа-я-]*$/i.test(firstName);
  // const lastNameError = !/^[a-zа-я-]*$/i.test(lastName);xc
  // const passportSeriesError = !/^[0-9]*$/.test(passportSeries);
  // const passportNumberError = !/^[0-9]*$/.test(passportNumber);

  // const formValid =
  //   !!firstName &&
  //   !!lastName &&
  //   !!birthday &&
  //   !!passportSeries &&
  //   !!passportNumber &&
  //   !(
  //     firstNameError ||
  //     lastNameError ||
  //     passportSeriesError ||
  //     passportNumberError
  //   );

  const {
    fromCityId,
    toCityId,
    fromAirport,
    toAirport,
    company,
    fromDatetime,
    toDatetime,
    passengersCount,
    price,
    ticketClass,
  } = cartData;

  const { data: cities } = useCities(fromCityId, toCityId);

  useEffect(() => {
    if (cities) {
      console.log("Cities:", cities);
    }
  }, [cities]);

  const dayFrom = fromDatetime.getDate();
  const monthFrom = months[fromDatetime.getMonth() + 1];
  const yearFrom = fromDatetime.getFullYear();
  const hoursFrom = fromDatetime.getHours();
  const minutesFrom = fromDatetime.getMinutes();

  const dateFrom = `${dayFrom} ${monthFrom} ${yearFrom}`;
  const timeFrom = `${hoursFrom}:${minutesFrom}`;

  const dayTo = toDatetime.getDate();
  const monthTo = months[toDatetime.getMonth() + 1];
  const yearTo = toDatetime.getFullYear();
  const hoursTo = toDatetime.getHours();
  const minutesTo = toDatetime.getMinutes();

  const dateTo = `${dayTo} ${monthTo} ${yearTo}`;
  const timeTo = `${hoursTo}:${minutesTo}`;

  let passengerEnding;

  if (passengersCount == 1) {
    passengerEnding = "пассажир";
  } else if (2 <= passengersCount && passengersCount <= 4) {
    passengerEnding = "пассажира";
  } else if (5 <= passengersCount && passengersCount <= 9) {
    passengerEnding = "пассажиров";
  }

  const [currentTab, setCurrentTab] = useState<"flight" | "passengerData">(
    "flight",
  );

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await fetch(`/api/booking-page`, {
      method: "POST",
      body: JSON.stringify({ routeId: "dc9ffa56-3069-495b-bb8f-68874104dbe9" }),
    });

    const query = new URLSearchParams({
      fromCity: cities?.fromCity,
      toCity: cities?.toCity,
      company,
      dateFrom,
      timeFrom,
      fromAirport,
      toAirport,
      fromDatetime: String(fromDatetime),
      toDatetime: String(toDatetime),
      price: String(price),
    }).toString();

    router.push(`/booking-success-page?${query}`);
  };

  return (
    <Layout>
      <div className="flex flex-col justify-self-center w-full md:w-auto gap-3">
        <div className="flex items-center gap-2 md:mb-6">
          <Arrow className="hidden lg:inline" />
          <h1 className="text-xl md:text-3xl font-bold">Бронирование</h1>
        </div>
        <nav className="inline md:hidden">
          <ul className='flex gap-3.5 relative after:content-[""] after:h-[1px] after:bg-gray-300 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-full'>
            <li
              className={`flex relative px-4 text-sm ${
                currentTab === "flight"
                  ? 'text-blue-500 after:content-[""] after:h-0.5 after:bg-blue-500 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-full'
                  : "text-gray-500"
              }`}
              onClick={() => setCurrentTab("flight")}
            >
              Рейс
            </li>
            <li
              className={`flex relative px-4 text-sm ${
                currentTab === "passengerData"
                  ? 'text-blue-500 after:content-[""] after:h-0.5 after:bg-blue-500 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-full'
                  : "text-gray-500"
              }`}
              onClick={() => setCurrentTab("passengerData")}
            >
              Данные пассажира
            </li>
          </ul>
        </nav>
        <form
          className="flex flex-col gap-5 lg:flex-row"
          onSubmit={handleSubmit}
        >
          <div
            className={`flex flex-col md:gap-3 bg-white px-6 py-5 shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg`}
          >
            <div
              className={`flex flex-col md:gap-3 bg-white ${
                currentTab === "flight" ? "flex" : "hidden"
              } md:flex`}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-0 leading-none">
                Рейс
              </h2>
              <div className="flex flex-col justify-between items-center md:flex-row gap-3">
                <div className="flex flex-col gap-2 self-start">
                  <div className="flex gap-2 items-center text-sm md:text-base">
                    <p>{`${cities?.fromCity} ${fromAirport}`}</p>
                    <Arrow className="rotate-180 w-5 h-2.5" />
                    <p>{`${cities?.toCity} ${toAirport}`}</p>
                  </div>
                  <div className="flex gap-2 items-center text-sm md:text-base">
                    <p>{`${dateFrom} ${timeFrom}`}</p>
                    <Arrow className="rotate-180 w-5 h-2.5" />
                    <p>{dayTo > dayFrom ? `${dateTo} ${timeTo}` : timeTo}</p>
                  </div>
                </div>
                <div className="flex md:flex-col gap-1 md:mr-32 items-center self-stretch md:self-start md:items-start justify-between mb-1.5">
                  <p className="text-gray-400 text-xs h-4">Авиакомпания</p>
                  <p className="text-sm md:text-base">«{company}»</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-1.5">
                <div className="flex flex-row gap-1 md:w-[225px] md:flex-col justify-between">
                  <p className="text-gray-400 text-xs">Пассажиров</p>
                  <p className="text-sm md:text-base">{`${passengersCount} ${passengerEnding}`}</p>
                </div>
                <div className="flex flex-row gap-1 md:w-[225px] md:flex-col justify-between">
                  <p className="text-gray-400 text-xs">Класс</p>
                  <p className="text-sm md:text-base">{ticketClass}</p>
                </div>
                <div className="flex flex-row gap-1 md:w-[180px] md:flex-col justify-between">
                  <p className="text-gray-400 text-xs">Цена</p>
                  <p className="text-sm md:text-base">{price} ₽</p>
                </div>
              </div>
            </div>
            <Separator extraClass="hidden md:flex" />
            <div
              className={`flex flex-col gap-3 ${
                currentTab === "passengerData" ? "flex" : "hidden"
              } md:flex`}
            >
              {(() => {
                const passengers = [];
                for (let count = 1; count <= passengersCount; count++) {
                  passengers.push(
                    <PassengerInputs count={count} key={count} />,
                  );
                }
                return passengers;
              })()}
            </div>
          </div>
          <div className="flex flex-col gap-3 bg-white md:rounded-lg px-5 md:px-4 py-5 shadow-[0_4px_8px_rgba(0,0,0,0.15)] self-start w-screen md:w-auto ms-[-20px] md:ms-0">
            <div className="justify-between items-end hidden md:flex">
              <p className="text-gray-500 text-xs">Перелёт:</p>
              <p className="text-sm">{price} ₽</p>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-gray-500 text-xs">Общая сумма:</p>
              <p className="text-green-500 text-2xl font-bold">{price} ₽</p>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-gray-100 px-16 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-300 text-sm md:text-base"
              // disabled={!formValid}
            >
              Забронировать
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
