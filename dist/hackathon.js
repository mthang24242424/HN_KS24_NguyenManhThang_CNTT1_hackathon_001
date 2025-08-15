"use strict";
const readline = require("readline-sync");
class Person {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    getDetails() {
        console.log(`ID: ${this.id} - Name: ${this.name} - Email: ${this.email} - Phone: ${this.phone}`);
    }
}
class Room {
    constructor(roomId, type, pricePerNight, isAvaiable) {
        this.roomId = roomId;
        this.type = type;
        this.pricePerNight = pricePerNight;
        this.isAvaiable = isAvaiable;
    }
    bookRoom() {
        this.isAvaiable = false;
    }
    releaseRoom() {
        this.isAvaiable = true;
    }
}
class StandardRoom extends Room {
    calculateCost(nights) {
        return this.pricePerNight * nights;
    }
    getAdditionalServices() {
        return ["Không có dịch vụ bổ sung"];
    }
    getCancellationPolicy() {
        return "Hoàn lại 100% nếu hủy trước 1 ngày";
    }
}
class DeluxeRoom extends Room {
    calculateCost(nights) {
        return this.pricePerNight * nights + 100 * nights;
    }
    getAdditionalServices() {
        return ["Dịch vụ ăn sáng"];
    }
    getCancellationPolicy() {
        return "Hoàn lại 50% nếu hủy trước 2 ngày";
    }
}
class SuiteRoom extends Room {
    calculateCost(nights) {
        return this.pricePerNight * nights + 200 * nights;
    }
    getAdditionalServices() {
        return ["Spa", "Minibar"];
    }
    getCancellationPolicy() {
        return "Không hoàn tiền nếu hủy";
    }
}
class Booking {
    constructor(bookingId, customer, room, nights, totalCost) {
        this.bookingId = bookingId;
        this.customer = customer;
        this.room = room;
        this.nights = nights;
        this.totalCost = totalCost;
    }
    getDetails() {
        console.log(`Booking ID: ${this.bookingId}`);
        this.customer.getDetails();
        console.log(`Phòng ID: ${this.room.roomId} - Loại: ${this.room.type} - Giá: ${this.room.pricePerNight}`);
        console.log(`Số đêm: ${this.nights} - Tổng chi phí: ${this.totalCost}`);
    }
}
class HotelManager {
    constructor(rooms = [], bookings = [], customers = []) {
        this.rooms = rooms;
        this.bookings = bookings;
        this.customers = customers;
    }
    addRoom(type, pricePerNight) {
        let room;
        const newRoomId = this.rooms.length + 1;
        switch (type.toLowerCase()) {
            case "standard":
                room = new StandardRoom(newRoomId, type, pricePerNight, true);
                break;
            case "deluxe":
                room = new DeluxeRoom(newRoomId, type, pricePerNight, true);
                break;
            case "suite":
                room = new SuiteRoom(newRoomId, type, pricePerNight, true);
                break;
            default:
                console.log("Loại phòng không hợp lệ.");
                return;
        }
        this.rooms.push(room);
        console.log(`Đã thêm mới phòng ${type}`);
    }
    addCustomer(name, email, phone) {
        const id = this.customers.length + 1;
        const customer = new Person(id, name, email, phone);
        this.customers.push(customer);
        return customer;
    }
    bookRoom(customerId, roomId, nights) {
        const customer = this.customers.find(c => c.id === customerId);
        const room = this.rooms.find(r => r.roomId === roomId && r.isAvaiable);
        if (!customer || !room) {
            throw new Error("Không tìm thấy khách hàng hoặc phòng");
        }
        room.bookRoom();
        const totalCost = room.calculateCost(nights);
        const booking = new Booking(this.bookings.length + 1, customer, room, nights, totalCost);
        this.bookings.push(booking);
        return booking;
    }
    releaseRoom(roomId) {
        const room = this.rooms.find(r => r.roomId === roomId);
        if (room) {
            room.releaseRoom();
            console.log("Đã trả phòng.");
        }
    }
    listAvailableRooms() {
        const availableRooms = this.rooms.filter(r => r.isAvaiable);
        if (availableRooms.length === 0) {
            console.log("Không có phòng trống.");
            return;
        }
        availableRooms.forEach(r => console.log(`Phòng ID: ${r.roomId}, Loại: ${r.type}, Giá: ${r.pricePerNight}`));
    }
    listBookingsByCustomer(customerId) {
        const bookings = this.bookings.filter(b => b.customer.id === customerId);
        if (bookings.length === 0) {
            console.log("Khách hàng chưa có đặt phòng.");
            return;
        }
        bookings.forEach(b => b.getDetails());
    }
    calculateTotalRevenue() {
        return this.bookings.reduce((sum, b) => sum + b.totalCost, 0);
    }
    getRoomTypesCount() {
        const countMap = this.rooms.reduce((acc, room) => {
            acc[room.type] = (acc[room.type] || 0) + 1;
            return acc;
        }, {});
        console.log("Số lượng từng loại phòng:");
        for (const type in countMap) {
            console.log(`${type}: ${countMap[type]}`);
        }
    }
    applyDiscountToRoom(roomId, discountRate) {
        const index = this.rooms.findIndex(r => r.roomId === roomId);
        if (index !== -1) {
            this.rooms[index].pricePerNight *= (1 - discountRate);
            console.log(`Đã áp dụng giảm giá ${discountRate * 100}% cho phòng ID ${roomId}`);
        }
    }
    getRoomServices(roomId) {
        const room = this.rooms.find(r => r.roomId === roomId);
        if (room) {
            console.log(`Dịch vụ bổ sung: ${room.getAdditionalServices().join(", ")}`);
        }
    }
    getCancellationPolicy(roomId) {
        const room = this.rooms.find(r => r.roomId === roomId);
        if (room) {
            console.log(`Chính sách hủy: ${room.getCancellationPolicy()}`);
        }
    }
}
// === MENU ===
const hotelManager = new HotelManager();
while (true) {
    console.log("\n===== MENU CHỨC NĂNG =====");
    console.log("1. Thêm khách hàng ");
    console.log("2. Thêm phòng ");
    console.log("3. Đặt phòng ");
    console.log("4. Trả phòng ");
    console.log("5. Hiển thị phòng trống ");
    console.log("6. Hiển thị đặt phòng của khách ");
    console.log("7. Tính tổng doanh thu ");
    console.log("8. Đếm số lượng từng loại phòng ");
    console.log("9. Áp dụng giảm giá cho phòng ");
    console.log("10. Hiển thị dịch vụ bổ sung ");
    console.log("11. Hiển thị chính sách hủy ");
    console.log("0. Thoát chương trình");
    const choice = readline.questionInt("Chon chuc nang: ");
    switch (choice) {
        case 1: {
            const name = readline.question("Nhap ten khach hang: ");
            const email = readline.question("Nhap email: ");
            const phone = readline.question("Nhap so dien thoai: ");
            hotelManager.addCustomer(name, email, phone);
            console.log("Đã thêm khách hàng.");
            break;
        }
        case 2: {
            const type = readline.question("Nhap loai phong (standard/deluxe/suite): ");
            const price = readline.questionFloat("Nhap gia moi dem: ");
            hotelManager.addRoom(type, price);
            break;
        }
        case 3: {
            const customerId = readline.questionInt("Nhap ID khach hang: ");
            const roomId = readline.questionInt("Nhap ID phong: ");
            const nights = readline.questionInt("Nhap so dem: ");
            try {
                const booking = hotelManager.bookRoom(customerId, roomId, nights);
                console.log("Đã đặt phòng, tổng chi phí:", booking.totalCost);
            }
            catch (err) {
                console.log("Ko thể đặt phòng", err.message);
            }
            break;
        }
        case 4: {
            const roomId = readline.questionInt("Nhap ID phong: ");
            hotelManager.releaseRoom(roomId);
            break;
        }
        case 5:
            hotelManager.listAvailableRooms();
            break;
        case 6: {
            const customerId = readline.questionInt("Nhap ID khach hang: ");
            hotelManager.listBookingsByCustomer(customerId);
            break;
        }
        case 7:
            console.log("Tổng doanh thu:", hotelManager.calculateTotalRevenue());
            break;
        case 8:
            hotelManager.getRoomTypesCount();
            break;
        case 9: {
            const roomId = readline.questionInt("Nhap ID phong: ");
            const discount = readline.questionFloat("Nhap ti le giam ( 0.1 = 10%): ");
            hotelManager.applyDiscountToRoom(roomId, discount);
            break;
        }
        case 10: {
            const roomId = readline.questionInt("Nhap ID phong: ");
            hotelManager.getRoomServices(roomId);
            break;
        }
        case 11: {
            const roomId = readline.questionInt("Nhap ID phong: ");
            hotelManager.getCancellationPolicy(roomId);
            break;
        }
        case 0:
            console.log("Thoát chương trình");
            process.exit();
        default:
            console.log("Lựa chọn không hợp lệ!");
    }
}
