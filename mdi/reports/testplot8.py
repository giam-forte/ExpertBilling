#!/usr/bin/env python

"""PyQt4 port of the richtext/orderform example from Qt v4.x"""

import sys, time
from PyQt4 import QtCore, QtGui
from bpcanvas import staticQtMplCanvas, staticMplCanvas
from PIL import Image as PILImage
from StringIO import StringIO
from datetime import datetime
#Qbuffer, Qtemporaryfile
from bpmplQImage import bpmplQImage as bpQImage_t
from bpcdQImage import bpcdQImage as bpQImage

class MainWindow(QtGui.QMainWindow):
    def __init__(self):
        QtGui.QMainWindow.__init__(self)

        fileMenu = QtGui.QMenu(self.tr("&File"), self)
        newAction = fileMenu.addAction(self.tr("&New..."))
        newAction.setShortcut(self.tr("Ctrl+N"))
        self.printAction = fileMenu.addAction(self.tr("&Print..."), self.printFile)
        self.printAction.setShortcut(self.tr("Ctrl+P"))
        self.printAction.setEnabled(False)
        quitAction = fileMenu.addAction(self.tr("E&xit"))
        quitAction.setShortcut(self.tr("Ctrl+Q"))
        self.menuBar().addMenu(fileMenu)

        self.letters = QtGui.QTabWidget()

        self.connect(newAction, QtCore.SIGNAL("triggered()"), self.openDialog)
        self.connect(quitAction, QtCore.SIGNAL("triggered()"), self, QtCore.SLOT("close()"))
        self.setCentralWidget(self.letters)
        self.setWindowTitle(self.tr("Order Form"))


    def createLetter(self, name, address, orderItems, sendOffers):
        editor = QtGui.QTextEdit()
        cursor = editor.textCursor()
        cursor.movePosition(QtGui.QTextCursor.Start)
        topFrame = cursor.currentFrame()
        topFrameFormat = topFrame.frameFormat()
        topFrameFormat.setPadding(16)
        topFrame.setFrameFormat(topFrameFormat)

        textFormat = QtGui.QTextCharFormat()
        boldFormat = QtGui.QTextCharFormat()
        boldFormat.setFontWeight(QtGui.QFont.Bold)

        referenceFrameFormat = QtGui.QTextFrameFormat()
        referenceFrameFormat.setBorder(1)
        referenceFrameFormat.setPadding(8)
        referenceFrameFormat.setPosition(QtGui.QTextFrameFormat.FloatRight)
        referenceFrameFormat.setWidth(QtGui.QTextLength(QtGui.QTextLength.PercentageLength, 40))
        cursor.insertFrame(referenceFrameFormat)

        cursor.insertText("A company", boldFormat)
        cursor.insertBlock()
        cursor.insertText("321 City Street")
        cursor.insertBlock()
        cursor.insertText("Industry Park")
        cursor.insertBlock()
        cursor.insertText("Another country")

        cursor.setPosition(topFrame.lastPosition())

        cursor.insertText(name, textFormat)
        for line in address.split("\n"):
            cursor.insertBlock()
            cursor.insertText(line)

        cursor.insertBlock()
        cursor.insertBlock()

        date = QtCore.QDate.currentDate()
        cursor.insertText(self.tr("Date: %1").arg(date.toString("d MMMM yyyy")), textFormat)
        cursor.insertBlock()

        bodyFrameFormat = QtGui.QTextFrameFormat()
        bodyFrameFormat.setWidth(QtGui.QTextLength(QtGui.QTextLength.PercentageLength, 100))
        cursor.insertFrame(bodyFrameFormat)

        cursor.insertText(self.tr("I would like to place an order for the "
                          "following items:"), textFormat)
        cursor.insertBlock()
        cursor.insertBlock()
 
        testperf = time.clock()
        #sc = staticMplCanvas( 10, 5, 75, "usertotalbytes", 15, '2008-07-02 17:43:01.296000+03:00', '2008-07-02 18:49:01.296000+03:00', 120)
        #sc = staticMplCanvas(8, 8, 75, "userstotalpie", '2008-07-02 17:43:01.296000+03:00', '2008-07-02 18:49:01.296000+03:00', (15, 16))
        sfm = '%Y-%m-%d %H:%M:%S'
        tm5 = datetime.strptime('2008-07-06 11:02:30', sfm)
        tm6 = datetime.strptime('2008-07-10 18:15:01', sfm)
        #z = []
        '''sc = staticMplCanvas(8, 8, 75,  'w', "userstrafpie", tm1, tm6, (15, 16))        
        sc.draw()
        
        qtbuf = QtCore.QBuffer()
        qtbuf.open(QtCore.QIODevice.Truncate | QtCore.QIODevice.WriteOnly)
        
        sc.print_png(qtbuf)
        qtbuf.close()
        qtbuf.open(QtCore.QIODevice.ReadOnly)
        img = QtGui.QImage()
        #img.load(qtbuf, 'JPEG')
        img.load(qtbuf, 'png')'''
        #drawer = bpQImage()
        drawer = bpQImage()
        
        img = drawer.bpdraw("nfs_user_traf", 17, tm5, tm6, 300)
        #img = bpcdQImage("nfs_user_traf", 17, tm5, tm6, 300)
        tdoc = editor.document()
        tdoc.addResource(QtGui.QTextDocument.ImageResource, QtCore.QUrl("mytmi"), QtCore.QVariant(img))
        cursor.insertImage("mytmi")
        print time.clock() - testperf
        orderTableFormat = QtGui.QTextTableFormat()
        orderTableFormat.setAlignment(QtCore.Qt.AlignHCenter)
        orderTable = cursor.insertTable(1, 2, orderTableFormat)

        orderFrameFormat = cursor.currentFrame().frameFormat()
        orderFrameFormat.setBorder(1)
        cursor.currentFrame().setFrameFormat(orderFrameFormat)

        cursor = orderTable.cellAt(0, 0).firstCursorPosition()
        cursor.insertText(self.tr("Product"), boldFormat)
        cursor = orderTable.cellAt(0, 1).firstCursorPosition()
        cursor.insertText(self.tr("Quantity"), boldFormat)

        for item in orderItems:
            row = orderTable.rows()

            orderTable.insertRows(row, 1)
            cursor = orderTable.cellAt(row, 0).firstCursorPosition()
            cursor.insertText(item[0], textFormat)
            cursor = orderTable.cellAt(row, 1).firstCursorPosition()
            cursor.insertText(QtCore.QString("%1").arg(item[1]), textFormat)

        cursor.setPosition(topFrame.lastPosition())

        cursor.insertText(self.tr("Please update my records to take account of the "
                                  "following privacy information:"))
        cursor.insertBlock()

        offersTable = cursor.insertTable(2, 2)

        cursor = offersTable.cellAt(0, 1).firstCursorPosition()
        cursor.insertText(self.tr("I want to receive more information about your "
                                  "company's products and special offers."), textFormat)
        cursor = offersTable.cellAt(1, 1).firstCursorPosition()
        cursor.insertText(self.tr("I do not want to receive any promotional information "
                                  "from your company."), textFormat)

        if sendOffers:
            cursor = offersTable.cellAt(0, 0).firstCursorPosition()
        else:
            cursor = offersTable.cellAt(1, 0).firstCursorPosition()

        cursor.insertText("X", boldFormat)

        cursor.setPosition(topFrame.lastPosition())
        cursor.insertBlock()
        cursor.insertText(self.tr("Sincerely,"), textFormat)
        cursor.insertBlock()
        cursor.insertBlock()
        cursor.insertBlock()
        cursor.insertText(name)

        self.printAction.setEnabled(True)
        return editor

    def createSample(self):
        dialog = DetailsDialog("Dialog with default values", self)
        editor = self.createLetter("Mr Smith", "12 High Street\nSmall Town\nThis country",dialog.orderItems(), True)
        tabIndex = self.letters.addTab(editor, "Mr Smith")
        self.letters.setCurrentIndex(tabIndex)

    def openDialog(self):
        dialog = DetailsDialog(self.tr("Enter Customer Details"), self)

        if dialog.exec_() == QtGui.QDialog.Accepted:
            editor = self.createLetter(dialog.senderName(), dialog.senderAddress(),dialog.orderItems(), dialog.sendOffers())
            tabIndex = self.letters.addTab(editor, dialog.senderName())
            self.letters.setCurrentIndex(tabIndex)

    def printFile(self):
        editor = self.letters.currentWidget()
        document = editor.document()
        printer = QtGui.QPrinter()

        dialog = QtGui.QPrintDialog(printer, self)
        dialog.setWindowTitle(self.tr("Print Document"))
        if dialog.exec_() != QtGui.QDialog.Accepted:
            return

        document.print_(printer)


class DetailsDialog(QtGui.QDialog):
    def __init__(self, title, parent=None):
        QtGui.QDialog.__init__(self, parent)

        self.items = QtCore.QStringList()

        nameLabel = QtGui.QLabel(self.tr("Name:"))
        addressLabel = QtGui.QLabel(self.tr("Address:"))

        self.nameEdit = QtGui.QLineEdit()
        self.addressEdit = QtGui.QTextEdit()
        self.addressEdit.setPlainText("")
        self.offersCheckBox = QtGui.QCheckBox(self.tr("Send offers:"))

        self.setupItemsTable()

        okButton = QtGui.QPushButton(self.tr("OK"))
        cancelButton = QtGui.QPushButton(self.tr("Cancel"))
        okButton.setDefault(True)

        self.connect(okButton, QtCore.SIGNAL("clicked()"), self.verify)
        self.connect(cancelButton, QtCore.SIGNAL("clicked()"), self, QtCore.SLOT("reject()"))

        detailsLayout = QtGui.QGridLayout()
        detailsLayout.addWidget(nameLabel, 0, 0)
        detailsLayout.addWidget(self.nameEdit, 0, 1)
        detailsLayout.addWidget(addressLabel, 1, 0)
        detailsLayout.addWidget(self.addressEdit, 1, 1)
        detailsLayout.addWidget(self.itemsTable, 0, 2, 2, 2)
        detailsLayout.addWidget(self.offersCheckBox, 2, 1, 1, 4)

        buttonLayout = QtGui.QHBoxLayout()
        buttonLayout.addStretch(1)
        buttonLayout.addWidget(okButton)
        buttonLayout.addWidget(cancelButton)

        mainLayout = QtGui.QVBoxLayout()
        mainLayout.addLayout(detailsLayout)
        mainLayout.addLayout(buttonLayout)
        self.setLayout(mainLayout)

        self.setWindowTitle(title)

    def setupItemsTable(self):
        self.items << self.tr("T-shirt") << self.tr("Badge") \
                   << self.tr("Reference book") << self.tr("Coffee cup")

        self.itemsTable = QtGui.QTableWidget(self.items.count(), 2)

        for row in range(self.items.count()):
            name = QtGui.QTableWidgetItem(self.items[row])
            name.setFlags(QtCore.Qt.ItemIsEnabled | QtCore.Qt.ItemIsSelectable)
            self.itemsTable.setItem(row, 0, name)
            quantity = QtGui.QTableWidgetItem("1")
            self.itemsTable.setItem(row, 1, quantity)

    def orderItems(self):
        orderList = []

        for row in range(self.items.count()):
            item = [None, None]
            item[0] = self.itemsTable.item(row, 0).text()
            quantity = self.itemsTable.item(row, 1).data(QtCore.Qt.DisplayRole).toInt()[0]
            item[1] = max(0, quantity)
            orderList.append(item)

        return orderList

    def senderName(self):
        return self.nameEdit.text()

    def senderAddress(self):
        return self.addressEdit.toPlainText()

    def sendOffers(self):
        return self.offersCheckBox.isChecked()

    def verify(self):
        if not self.nameEdit.text().isEmpty() and not self.addressEdit.toPlainText().isEmpty():
            self.accept()
            return

        answer = QtGui.QMessageBox.warning(self, self.tr("Incomplete Form"),
                    self.tr("The form does not contain all the necessary "
                            "information.\nDo you want to discard it?"),
                    QtGui.QMessageBox.Yes, QtGui.QMessageBox.No)

        if answer == QtGui.QMessageBox.Yes:
            self.reject()


if __name__ == '__main__':
    app = QtGui.QApplication(sys.argv)
    window = MainWindow()
    window.resize(640, 480)
    window.show()
    window.createSample()
    sys.exit(app.exec_()) 